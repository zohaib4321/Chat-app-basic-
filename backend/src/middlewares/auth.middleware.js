const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new Error(401, "Unauthorized request")
        }
    
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // const userone = decodedToken.select("-password")
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        // console.log(user);
        if (!user) {
            
            throw new Error(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new Error(401, error?.message || "Invalid access token")
    }
})

module.exports = verifyJWT
