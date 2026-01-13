import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import TrainBot from "../components/TrainBot";
import TrainingFiles from "../components/TrainingFiles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Admin = () => {
  const [view, setView] = useState("chat");

  // 🔥 MULTI CHAT STATE
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(localStorage.getItem("chatId"));

  // ✅ shared trigger for refreshing file list
  const [filesVersion, setFilesVersion] = useState(0);

  /* 🔄 LOAD ALL CHATS */
  const loadChats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chats`);
      setChats(res.data || []);
    } catch (err) {
      console.error("Failed to load chats", err);
      setChats([]);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  /* ➕ NEW CHAT */
  const newChat = () => {
    localStorage.removeItem("chatId");
    setActiveChat(null);
    setView("chat");
  };

  /* 📂 SELECT CHAT */
  const selectChat = (id) => {
    localStorage.setItem("chatId", id);
    setActiveChat(id);
    setView("chat");
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* LEFT SIDEBAR (ONLY ONE ✅) */}
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={selectChat}
        onNewChat={newChat}
        reloadChats={loadChats}
        setView={setView}
        view={view}
      />

      {/* CENTER */}
      <div className="flex-1 bg-white">
        {view === "chat" ? (
          <ChatBox
            chatId={activeChat}
            setActiveChat={setActiveChat}
            onChatCreated={loadChats}
          />
        ) : (
          <TrainBot
            onBack={() => setView("chat")}
            onFilesUpdated={() => setFilesVersion((v) => v + 1)}
          />
        )}
      </div>

      {/* RIGHT PANEL */}
      {view === "train" && (
        <div className="w-80 border-l bg-gray-50 p-4">
          <TrainingFiles refreshKey={filesVersion} />
        </div>
      )}
    </div>
  );
};

export default Admin;
