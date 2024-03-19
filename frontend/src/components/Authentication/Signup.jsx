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

function Signup() {
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

    const submitHandler = (e) => {
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
            return;
        }
        setLoading(false);
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
        setLoading(false);
        console.log(username, email, password, pic);
        axios
            .post("/api/users/", {
                username,
                email,
                password,
                pic,
            })
            .then((data) => {
                console.log(data);
                if (!data) return;
                toast({
                    title: "Registration Successful",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: <>{err.response.data.message}</>,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            })
            .finally(() => {
                setLoading(false);
            });
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
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        value={confirmpassword}
                        type={show ? "text" : "password"}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic" isRequired>
                <FormLabel>Upload your Picture</FormLabel>
                <Input type="file" value={pic} p={1.5} accept="image/*" />
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
