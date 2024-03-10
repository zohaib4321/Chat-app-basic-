import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    useToast,
} from '@chakra-ui/react'
import axios from 'axios'

function Login() {
    const [show, setShow] = useState(false)

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const toast = useToast()
    const navigate = useNavigate()  

    const handleShow = () => setShow(!show)

    const submitHandler = (e) => {
        e.preventDefault()
        setLoading(true)
        if (!email || !password) {
            toast({
                title: 'Please Fill all the Feilds',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false)
            return;
        }

        console.log(email, password)
            axios.post(
                "/api/users/login",
                {
                    email,
                    password,
                },
            )
            .then((data) => {
                console.log(data)
                if(!data) return;
                toast({
                title: 'Login Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })

            localStorage.setItem("userInfo", JSON.stringify(data))
            // navigate("/chats")
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
                setLoading(false)
            })
        }
    return (
    <VStack spacing="5px">
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
            type="email"
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size='md'>
            <Input
            type={show ? "text" : "password"}
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleShow}>
                    {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        
        <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        >
        Login
        </Button>
    </VStack>
)
}

export default Login
