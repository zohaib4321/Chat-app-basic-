const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
const { notFound, errorHandler } = require("./middlewares/error.middleware.js");

const app = express();
const port = process.env.PORT;

dotenv.config({
	path: "./env",
});

connectDB();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// imports
const userRoutes = require("./routes/user.route.js");
app.use("/api/users", userRoutes);

// chat routes
const chatRoutes = require("./routes/chat.route.js");
app.use("/api/chat", chatRoutes);

// message routes
const messageRoutes = require("./routes/message.route.js");
app.use("/api/message", messageRoutes);

// middlewares
app.use(notFound);
app.use(errorHandler);

// server listen
const server = app.listen(port, () => {
	console.log(`Server running at port ${port}`);
});

const io = require("socket.io")(server, {
	pingTimeout: 60000,
	cors: {
		origin: "http://localhost:5173",
	},
});

io.on("connection", (socket) => {
	// console.log("User connected");
	socket.on("setup", (userData) => {
		socket.join(userData._id);
		socket.emit("connected");
	});

	socket.on("join chat", (room) => {
		socket.join(room);
		// console.log("User Joined Room: " + room);
	});

	socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

	socket.on("new message", (newMessageRecieved) => {
		var chat = newMessageRecieved.chat;

		if (!chat.users) return console.log("chat.users not defined");

		chat.users.forEach((user) => {
			if (user._id == newMessageRecieved.sender._id) return;

			socket.in(user._id).emit("message recieved", newMessageRecieved);
		});
	});

    socket.off("setup", () => {
        // console.log("User disconnected");
        socket.leave(userData._id);
    });
});
