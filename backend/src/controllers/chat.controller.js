const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.js");
const Chat = require("../models/chat.model.js");

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res
        .status(401)
        .send("UserId param not sent with request")
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
    .populate("users", "-password")
    .populate("latestMessage");
    
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    })   
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
        };
    
        try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password",
        );
        res.status(200).json(FullChat);
        } catch (error) {
        res.status(400);
        throw new Error(error.message);
        }
    } 
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        const fetchedChats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } } )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort( {updatedAt: -1} )
        const result = await User.populate(fetchedChats, {
            path: "latestMessage.sender",
            select: "name pic email",
        })
        return res.status(201).send(result);
    } catch (error) {
        return res.status(400).send(error.message);
    }
})

const createGroupChat = asyncHandler(async (req, res) => {
    try {
        if (!req.body.name && !req.body.users) {
            return res.status(401).send({message: "Please fill all the fields"})
        }
        const users = JSON.parse(req.body.users);
    
        if (users.length < 2) {
            return res.status(401).send("More than 2 users are required to form a group chat");
        }
    
        users.push(req.user);

        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user,
        })

        const fullGroupChat = await Chat.find({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

        return res.status(201).json(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error)
    }
})

const renameGroupName = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updateGroupChatName = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true,
        }
    )
    if (!updateGroupChatName) {
        return res.status(400).json({message: "Chat not found"})
    }
    return res.status(201).json(updateGroupChatName)
})

const addNewParticipantToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!userId) {
        return res.status(401).send("Does not found user id")
    }

    const chat = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {
                users: userId
            },
        },
        {
            new: true
        }
        )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!chat){
        return res.status(401).send("Failed to add user")
    } else {
        return res.status(201).json(chat)
    }
})

const removeParticipantFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!userId) {
        return res.status(401).send("Does not found user id")
    }

    const chat = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {
                users: userId
            }
        },
        {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    return res.status(201).json(chat)
})

module.exports = { 
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroupName,
    addNewParticipantToGroup,
    removeParticipantFromGroup
}