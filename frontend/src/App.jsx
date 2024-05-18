import HomePage from "./pages/HomePage"
import ChatPage from "./pages/ChatPage"
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <div className="app">
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chats" element={<ChatPage />} />
    </Routes>

    </div>
  )
}

export default App
