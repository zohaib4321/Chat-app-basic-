import React from 'react'
import axios from "axios"
import {ChatState} from "../context/ChatProvider"
import {
    Box,
    Text,
    IconButton
} from "@chakra-ui/react"
import { ArrowBackIcon } from '@chakra-ui/icons'


function SingleChat({ fetchAgain, setFetchAgain }) {

    const {user, selectedChat, setSelectedChat} = ChatState()
    return (
    <>
    {
        selectedChat ? (
            <>
            <Text
                fontSize={{ base: "28px", md: "30px" }}
                pb={3}
                px={2}
                w="100%"
                fontFamily="Work sans"
                display="flex"
                justifyContent={{ base: "space-between" }}
                alignItems="center"
            >
                <IconButton
                    display={{ base: "flex", md: "none" }}
                    icon={<ArrowBackIcon />}
                    onClick={() => setSelectedChat("")}
                />
                {selectedChat.chatName
                    ? selectedChat.chatName
                    : selectedChat.user.name}
            </Text>
            </>
        ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3}>
            Click on a user to start chatting
            </Text>
        </Box>
        )
    }
    </>
)
}

export default SingleChat
