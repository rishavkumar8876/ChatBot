import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import {MyContext} from "./MyContext.jsx";
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    token, setToken,
    user, setUser,
    theme, setTheme
  }; 

  return (
    <div className='app' data-theme={theme}>
      <MyContext.Provider value={providerValues}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            token ? (
              <>
                <Sidebar />
                <ChatWindow />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      </MyContext.Provider>
    </div>
  )
}

export default App