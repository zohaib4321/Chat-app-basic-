import React, {useEffect, useState} from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import ScrollableChats from "./ScrollableChats"
import { 
	Spinner,
	FormControl,
	Input,
	useToast,
} from "@chakra-ui/react";
import './style.css'

function SingleChat({ fetchAgain, setFetchAgain }) {
	const toast = useToast()

	const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

	const { user, selectedChat, setSelectedChat } = ChatState();

	const fetchMessages = async() => {
		if (!selectedChat) return;
		try {
			setLoading(true)

			const { data } = await axios.get(
        `/api/message/${selectedChat._id}`
			)
			// console.log(data);
			setMessages(data);
      setLoading(false);
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
	}

	const sendMessage = async(e) => {
		if (e.key === "Enter" && newMessage) {
			try {
				const config = {
					headers: {
						"Content-type": "application/json"
					}
				}

				setNewMessage("")
				const {data} = await axios.post('/api/message',
				{
					content: newMessage,
					chatId: selectedChat._id,
				},
				config)
				console.log(data);
				setMessages([...messages, data]);
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
	}

	useEffect(() => {
		fetchMessages()
	}, [selectedChat])

	const typingHandler = (e) => {
		setNewMessage(e.target.value)
	}

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
					<Text fontSize="3xl" pb={3}>
						Click on a user to start chatting
					</Text>
				</Box>
			)}
		</>
	);
}

export default SingleChat;
