import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import ScrollableChats from "./ScrollableChats";
import { Spinner, FormControl, Input, useToast } from "@chakra-ui/react";
import "./style.css";
import io from "socket.io-client";
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json"

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
	const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

	const toast = useToast();

	const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

	const fetchMessages = async () => {
		if (!selectedChat) return;
		try {
			setLoading(true);

			const { data } = await axios.get(`/api/message/${selectedChat._id}`);
			// console.log(data);
			setMessages(data);
			setLoading(false);

			socket.emit("join chat", selectedChat._id);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Messages",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
	}, []);

	const sendMessage = async (e) => {
		if (e.key === "Enter" && newMessage) {
			socket.emit("stop typing", selectedChat._id);
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
					},
				};

				setNewMessage("");
				const { data } = await axios.post(
					"/api/message",
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					config
				);
				console.log(data);
				socket.emit("new message", data);
				setMessages([...messages, data]);
				// console.log(messages);
			} catch (error) {
				toast({
					title: "Error Occured!",
					description: "Failed to send the Message",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom",
				});
			}
		}
	};

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat]);

	useEffect(() => {
		socket.on("message recieved", (newMessageRecieved) => {
			if (
				!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id
			) {
				if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
			} else {
				setMessages([...messages, newMessageRecieved]);
			}
		});
	});

	const typingHandler = (e) => {
		setNewMessage(e.target.value);
		if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
	};

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						px={2}
						w="100%"
						display="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center"
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>
						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModal user={getSenderFull(user, selectedChat.users)} />
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModal
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessages={fetchMessages}
								/>
							</>
						)}
					</Text>
					<Box
						display="flex"
						flexDir="column"
						justifyContent="flex-end"
						p={3}
						bg="#E8E8E8"
						w="100%"
						h="100%"
						borderRadius="lg"
						overflowY="hidden"
					>
						{loading ? (
							<Spinner
								size="xl"
								w={20}
								h={20}
								alignSelf="center"
								margin="auto"
							/>
						) : (
							<div className="messages">
								<ScrollableChats messages={messages} />
							</div>
						)}
						<FormControl
							onKeyDown={sendMessage}
							id="first-name"
							isRequired
							mt={3}
						>
						{istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
							<Input
								variant="filled"
								bg="#E0E0E0"
								placeholder="Enter a message.."
								value={newMessage}
								onChange={typingHandler}
							/>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					h="100%"
				>
					<Text fontSize="lg" pb={3}>
						No chat selected
					</Text>
				</Box>
			)}
		</>
	);
}

export default SingleChat;
