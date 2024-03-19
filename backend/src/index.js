const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db.js")
const { notFound, errorHandler } = require("./middlewares/error.middleware.js")


const app = express()
const port = process.env.PORT

dotenv.config({
    path: "./env"
})

connectDB()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

// imports
const userRoutes = require("./routes/user.route.js")
app.use("/api/users", userRoutes)

// chat routes
const chatRoutes = require("./routes/chat.route.js")
app.use("/api/chat", chatRoutes)

// message routes
const messageRoutes = require("./routes/message.route.js")
app.use("/api/message", messageRoutes)


// middlewares
app.use(notFound)
app.use(errorHandler)

// server listen
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})
