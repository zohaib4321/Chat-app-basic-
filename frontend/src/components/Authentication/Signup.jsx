import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	VStack,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Button,
	useToast,
} from "@chakra-ui/react";
import axios from "axios";
import {ChatState} from "../../context/ChatProvider"

function Signup() {

	const { setUser } = ChatState()
	const [show, setShow] = useState(false);

	const [username, setUsername] = useState();
	const [email, setEmail] = useState();
	const [confirmpassword, setConfirmpassword] = useState();
	const [password, setPassword] = useState();
	const [pic, setPic] = useState();
	const [loading, setLoading] = useState(false);

	const toast = useToast();
	const navigate = useNavigate();

	const handleShow = () => setShow(!show);

	const submitHandler = async (e) => {
		e.preventDefault();
		setLoading(true);
		if (!username || !email || !password || !confirmpassword) {
			toast({
				title: "Please Fill all the Feilds",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false)
			return;
		}

		if (password !== confirmpassword) {
			toast({
				title: "Passwords Do Not Match",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		try {
			const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

			const { data } = await axios.post("/api/users", {
				username,
				email,
				password,
				pic,
			},
			config
			);
			console.log(data);
			toast({
			title: "Registration Successful",
			status: "success",
			duration: 5000,
			isClosable: true,
			position: "bottom",
		});

		setUser(data);
		localStorage.setItem("userInfo", JSON.stringify(data));
		setLoading(false);
		navigate("/chats");
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
	};

	return (
		<VStack spacing="5px">
			<FormControl id="username" isRequired>
				<FormLabel>Username</FormLabel>
				<Input
					type="text"
					placeholder="Enter your username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</FormControl>
			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup size="md">
					<Input
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</InputGroup>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup size="md">
					<Input
						value={confirmpassword}
						type="password"
						placeholder="Confirm password"
						onChange={(e) => setConfirmpassword(e.target.value)}
					/>
				</InputGroup>
			</FormControl>
			<Button
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={loading}
			>
				Sign Up
			</Button>
		</VStack>
	);
}

export default Signup;
