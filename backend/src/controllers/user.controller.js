const asyncHandler = require('express-async-handler')
const User = require('../models/user.model.js')


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new Error(500, "Something went wrong while generating access and refresh tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, pic } = req.body;

    if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
    res.status(400);
    throw new Error("User already exists");
    }

    const user = await User.create({
    username,
    email,
    password,
    pic,
    });

    if (user) {
    res.status(201).send(user);
    } else {
    res.status(400);
    throw new Error("User not created");
    }
});

const loginUser = asyncHandler(async(req, res) => {

    const {email, password} = req.body

    if (!password && !email) {
        throw new Error(400, "Password or Email is required")
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new Error(404, "User does not exist")
    }

    const isPasswordValid = await user.matchPassword(password)

    if (!isPasswordValid) {
        throw new Error(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .send(loggedInUser)
})

const getAllUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
    ? {
        $or: [
            {
                username: { $regex: req.query.search, $options: "i" }
            },
            {
                email: { $regex: req.query.search, $options: "i" }
            }
        ]
    } : {}

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
})

// const logoutUser = asyncHandler(async (req, res) => {
//     await User.findByIdAndUpdate(
//         req.user._id,
//         {
//             $set: {
//                 refreshToken: undefined,
//             }
//         },
//         {
//             new: true
//         }
//     )
//     res
//     .status(200)
//     .clearCookie("accessToken")
//     .clearCookie("refreshToken")
//     .send("User Logged Out Successfully")
// })


const logoutUser = asyncHandler(async (req, res) => {
    await User.deleteOne({_id: {$eq: req.user._id}})

    res.status(200)
    .send("logout successfully")
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
}
