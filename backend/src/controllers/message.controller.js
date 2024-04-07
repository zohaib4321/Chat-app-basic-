const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.js");
const Message = require("../models/message.model.js");
const Chat = require("../models/chat.model.js");

const sendMessage = asyncHandler(async (req, res) => {
	// chatId of a user you want to send message
	// content of a message
	// who is the sender of a message

	const { content, chatId } = req.body;

	if (!content || !chatId) {
		console.log("Invalid data passed into a request");
		return res.status(400).send("Invalid data passed into a request");
	}

	try {
		const newMessage = {
			sender: req.user._id,
			content: content,
			chat: chatId,
		};

		var message = await Message.create(newMessage);

		message = await message.populate("sender", "username pic")
		message = await message.populate("chat")
		message = await User.populate(message, {
			path: "chat.users",
			select: "username pic email",
		});

		await Chat.findByIdAndUpdate(
			req.body.chatId,
			{ latestMessage: message },
			{ new: true }
		);

		return res.json(message);
	} catch (error) {
		throw new Error(error.message);
	}
});

const allMessages = asyncHandler(async (req, res) => {
	try {
		const messages = await Message.find({ chat: req.params.chatId })
			.populate("sender", "username pic email")
			.populate("chat");
		res.json(messages);
	} catch (error) {
		throw new Error(error.message);
	}
});

module.exports = {
	sendMessage,
	allMessages
};
