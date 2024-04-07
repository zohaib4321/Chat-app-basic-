import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../Miscellaneous/ProfileModal";
import {
	Box,
	Tooltip,
	Button,
	Text,
	//menu
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	Avatar,
	//drawer
	useDisclosure,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Input,
	useToast,
	Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

function SideDrawer() {
	const {
		user,
		setSelectedChat,
		chats,
		setChats,
		notification,
		setNotification,
	} = ChatState();
	const navigate = useNavigate();
	const toast = useToast();

	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);

	// drawer
	const { isOpen, onOpen, onClose } = useDisclosure();

	//logout
	const logoutHandler = (e) => {
		e.preventDefault();
		localStorage.removeItem("userInfo");
		navigate("/");
	};

	//search
	const searchHandler = async () => {
		if (!search) {
			toast({
				title: "Please enter something in search",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}
		try {
			setLoading(true);
			const { data } = await axios.get(`/api/users?search=${search}`);

			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Search Results",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
		setLoading(false);
	};

	//access chat
	const accessChat = async (userId) => {
		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};

		try {
			setLoadingChat(true);
			const { data } = await axios.post("/api/chat", { userId }, config);

			if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="white"
				w="100%"
				p="5px 10px 5px 10px"
				borderWidth="5px"
			>
				<Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
					<Button onClick={onOpen}>
						<i class="fa-solid fa-magnifying-glass"></i>
						<Text display={{ base: "none", md: "flex" }} px={4}>
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize="2xl">Chat app</Text>
				<div>
					<Menu>
						<MenuButton p={1}>
							<NotificationBadge
								count={notification.length}
								effect={Effect.SCALE}
							/>
							<BellIcon fontSize="2xl" m={1} />
						</MenuButton>
						<MenuList pl={2}>
							{!notification.length && "No New Messages"}
							{notification.map((notif) => (
								<MenuItem
									key={notif._id}
									onClick={() => {
										setSelectedChat(notif.chat);
										setNotification(notification.filter((n) => n !== notif));
									}}
								>
									{notif.chat.isGroupChat
										? `New Message in ${notif.chat.chatName}`
										: `New Message from ${getSender(user, notif.chat.users)}`}
								</MenuItem>
							))}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size="sm"
								cursor="pointer"
								name={user.username}
								src={user.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModal>
							<MenuDivider />
							<MenuItem onClick={logoutHandler}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>

			<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

					<DrawerBody>
						<Box display="flex" pb={2}>
							<Input
								placeholder="Search..."
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button onClick={searchHandler}>Go</Button>
						</Box>
						{loading ? (
							<ChatLoading />
						) : (
							searchResult?.map((user) => (
								<UserListItem
									key={user._id}
									user={user}
									handleFunction={() => accessChat(user._id)}
								/>
							))
						)}
						{loadingChat && <Spinner ml="auto" display="flex" />}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}

export default SideDrawer;
