import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { useNavigate } from "react-router-dom"
import ProfileModal from "../Miscellaneous/ProfileModal"
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
} from "@chakra-ui/react"
import {
    BellIcon,
    ChevronDownIcon
} from "@chakra-ui/icons"
import ChatLoading from '../ChatLoading'

function SideDrawer() {

    const { user } = ChatState()
    const navigate = useNavigate()
    const toast = useToast()

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    // drawer
    const { isOpen, onOpen, onClose } = useDisclosure()

    //logout
    const logoutHandler = (e) => {
        e.preventDefault();
        localStorage.removeItem("userInfo")
        navigate('/')
    }

    //search

    const searchHandler = () => {
        if (!search) {
            toast({
            title: "Please Enter something in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
            });
            return;
        }
        try {
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
            }, 5000);
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
    }

return (
    <>
    <Box 
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
            <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                <Button onClick={onOpen}>
                <i class="fa-solid fa-magnifying-glass"></i>
                    <Text display={{ base: "none", md: "flex" }} px={4}>
                        Search User
                    </Text>
                </Button>
            </Tooltip>
            <Text fontSize="2xl">
                Chat app
            </Text>
            <div>
                <Menu>
                    <MenuButton p={1}>
                        <BellIcon fontSize="2xl" m={1} />
                    </MenuButton>
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar size="sm" cursor="pointer" name={user.data.username} src={user.data.pic}/>
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

    <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
    >
        <DrawerOverlay />
        <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

        <DrawerBody>
            <Box display="flex" pb={2}>
            <Input 
            placeholder='Search...'
            mr={2}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={searchHandler}>Go</Button>
            </Box>
            {
                loading ? <ChatLoading /> : <span>results</span>
            }
        </DrawerBody>
        </DrawerContent>
    </Drawer>
    </>
)
}

export default SideDrawer

