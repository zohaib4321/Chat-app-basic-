import React, { useState } from 'react'
import SideDrawer from '../components/Miscellaneous/SideDrawer'
import MyChats from "../components/MyChats"
import ChatBox from "../components/ChatBox"
import {Box}from '@chakra-ui/react'
import { ChatState } from '../context/ChatProvider'
import { useNavigate } from 'react-router-dom'


function ChatPage() {
  
  const { user } = ChatState()

  const [fetchAgain, setFetchAgain] = useState(false);

  const navigate = useNavigate()
  if (!user) {
    navigate('/')
  }
  
  return (
    <div style={{width: "100%"}}>
      {user && <SideDrawer />}
      <Box display='flex' justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      {user && <MyChats fetchAgain={fetchAgain} />}
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default ChatPage

