import { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "./ChatBox";
import Sidebar from "./Sidebar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatArea = () => {
  const [activeChat, setActiveChat] = useState(localStorage.getItem("chatId"));
  const [chats, setChats] = useState([]);
  const [view, setView] = useState("chat");

  const loadChats = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/chats`);
    setChats(res.data);
  };

  useEffect(() => {
    loadChats();
  }, []);

  const newChat = () => {
    localStorage.removeItem("chatId");
    setActiveChat(null);
  };

  const selectChat = (id) => {
    localStorage.setItem("chatId", id);
    setActiveChat(id);
  };

  return (
    <div className="h-full flex">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        setView={setView}
        onNewChat={newChat}
        onSelectChat={selectChat}
        reloadChats={loadChats}
      />

      <div className="flex-1 flex flex-col">
        {view === "chat" && (
          <ChatBox
            chatId={activeChat}
            onChatCreated={loadChats}
            setActiveChat={setActiveChat}
          />
        )}
      </div>
    </div>
  );
};

export default ChatArea;
