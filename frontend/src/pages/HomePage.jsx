import React from 'react'
import { 
  Container,
  Box, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
} from "@chakra-ui/react"
import Signup from "../components/Authentication/Signup"
import Login from "../components/Authentication/Login"
import {useNavigate} from "react-router-dom"
import { useEffect } from 'react'

function HomePage() {

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats")
    } 

  }, [navigate])


  return (
    <Container maxW="xl" centerContent display='grid' placeItems='center'>
      <Box
      bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px"
      >
    <Tabs variant='soft-rounded' colorScheme='green'>
      <TabList mb="1em">
        <Tab width="50%">Login</Tab>
        <Tab width="50%">Sign Up</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Login />
        </TabPanel>
        <TabPanel>
          <Signup />
        </TabPanel>
      </TabPanels>
    </Tabs>
    </Box>
    </Container>
  )
}

export default HomePage
