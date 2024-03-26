import { useState } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	FormControl,
	Input,
	useToast,
	Box,
	IconButton,
	Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";

function UpdateGroupChatModal({ fetchAgain, setFetchAgain }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user, selectedChat, setSelectedChat } = ChatState();

	const toast = useToast();
	const [groupChatName, setGroupChatName] = useState();
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameloading, setRenameLoading] = useState(false);

	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			return;
		}

		try {
			setLoading(true);
			const { data } = await axios.get(`/api/users?search=${search}`);
			//   console.log(data);
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
			setLoading(false);
		}
	};
	const handleRename = async () => {
		if (!groupChatName) return;
		try {
			setRenameLoading(true);
			const { data } = await axios.put(`/api/chat/rename`, {
				chatId: selectedChat._id,
				chatName: groupChatName,
			});
			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setRenameLoading(false);
		} catch {
			toast({
				title: "Error Occured!",
				description: "Failed to load the chat",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setRenameLoading(false);
		}
		setGroupChatName("");
	};
	const handleAddUser = async (userToAdd) => {
		if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
			toast({
				title: "User Already in group!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		if (selectedChat.groupAdmin._id !== user._id) {
			toast({
				title: "Only admins can add someone!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		try {
			setLoading(true);
			const { data } = await axios.put(`/api/chat/groupadd`, {
				chatId: selectedChat._id,
				userId: userToAdd._id,
			});

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
		setGroupChatName("");
		setSearch("");
	};
	const handleRemove = async (userToRemove) => {
		if (
			selectedChat.groupAdmin._id !== user._id &&
			userToRemove._id !== user._id
		) {
			toast({
				title: "Only admins can remove someone!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		try {
			setLoading(true);
			const { data } = await axios.put(`/api/chat/groupremove`, {
				chatId: selectedChat._id,
				userId: userToRemove._id,
			});

			userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
		setGroupChatName("");
		setSearch("");
	};
	return (
		<>
			<IconButton
				display={{ base: "flex" }}
				icon={<ViewIcon />}
				onClick={onOpen}
			/>

			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize="35px" display="flex" justifyContent="center">
						{selectedChat.chatName}
					</ModalHeader>

					<ModalCloseButton />
					<ModalBody display="flex" flexDir="column" alignItems="center">
						<Box w="100%" display="flex" flexWrap="wrap" pb={3}>
							{selectedChat.users.map((user) => (
								<UserBadgeItem
									key={user._id}
									user={user}
									handleFunction={() => handleRemove(user)}
								/>
							))}
						</Box>
						<FormControl display="flex">
							<Input
								placeholder="Chat Name"
								mb={3}
								value={groupChatName}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
							<Button
								variant="solid"
								colorScheme="teal"
								ml={1}
								isLoading={renameloading}
								onClick={handleRename}
							>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add User to group"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>

						{loading ? (
							<Spinner size="lg" />
						) : (
							searchResult?.map((user) => (
								<UserListItem
									key={user._id}
									user={user}
									handleFunction={() => handleAddUser(user)}
								/>
							))
						)}
					</ModalBody>
					<ModalFooter>
						<Button onClick={() => handleRemove(user)} colorScheme="red">
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default UpdateGroupChatModal;
