import { useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Sidebar = ({
  chats = [],
  activeChat,
  onSelectChat,
  onNewChat,
  reloadChats,
  setView,
  view,
}) => {
  useEffect(() => {
    reloadChats?.();
  }, []);

  /* 🗑 DELETE CHAT */
  const deleteChat = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/chats/${id}`);

      // agar active chat delete ho
      if (id === activeChat) {
        localStorage.removeItem("chatId");
        onNewChat();
      }

      reloadChats();
    } catch (err) {
      console.error("Failed to delete chat", err);
    }
  };

  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">Admin Panel</h2>

      {/* 🤖 TRAIN */}
      <button
        onClick={() => setView("train")}
        className={`mb-3 py-2 rounded text-white ${
          view === "train" ? "bg-blue-700" : "bg-blue-600"
        }`}
      >
        🤖 Train Bot
      </button>

      {/* 💬 CHAT MODE ONLY */}
      {view === "chat" && (
        <>
          {/* ➕ NEW CHAT */}
          <button
            onClick={onNewChat}
            className="mb-4 bg-gray-800 text-white py-2 rounded"
          >
            ➕ New Chat
          </button>

          {/* 💬 CHAT LIST */}
          <div className="flex-1 overflow-y-auto">
            <h4 className="text-sm font-semibold mb-2">Chats</h4>

            {chats.length === 0 && (
              <p className="text-xs text-gray-500">No chats yet</p>
            )}

            {chats.map((c) => (
              <div
                key={c._id}
                className={`flex items-center justify-between gap-2 p-2 rounded cursor-pointer text-sm mb-1 ${
                  activeChat === c._id ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              >
                {/* CHAT SELECT */}
                <span
                  onClick={() => onSelectChat(c._id)}
                  className="truncate flex-1"
                >
                  💬 {c.title || "New Chat"}
                </span>

                {/* 🗑 DELETE */}
                <button
                  onClick={() => deleteChat(c._id)}
                  className="text-red-500 hover:text-red-700 text-xs"
                  title="Delete chat"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
