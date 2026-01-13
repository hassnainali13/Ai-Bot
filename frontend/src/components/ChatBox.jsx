import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatBox = ({ chatId, setActiveChat, onChatCreated }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [starterMessages, setStarterMessages] = useState([]);
  const [selectedStarters, setSelectedStarters] = useState([]);

  const bottomRef = useRef(null);

  /* 🔥 LOAD STARTER MESSAGES */
  useEffect(() => {
    const loadStarters = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/starters`);
        setStarterMessages(res.data || []);
      } catch (err) {
        console.error("Failed to load starters", err);
      }
    };

    loadStarters();
  }, []);

  /* 🔄 LOAD CHAT WHEN chatId CHANGES */
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const loadChat = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/chats/${chatId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to load chat");
      }
    };

    loadChat();
  }, [chatId]);

  /* ⬇ AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 🏷 TOGGLE STARTER */
  const toggleStarter = (text) => {
    let updated;

    if (selectedStarters.includes(text)) {
      updated = selectedStarters.filter((t) => t !== text);
    } else {
      updated = [...selectedStarters, text];
    }

    setSelectedStarters(updated);
    setInput(updated.join(" "));
  };

  /* ✍ INPUT CHANGE */
  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);

    setSelectedStarters((prev) => prev.filter((t) => val.includes(t)));
  };

  /* 🚀 SEND MESSAGE */
  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [...prev, { role: "user", content: userText }]);

    setInput("");
    setSelectedStarters([]);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/chat`, {
        userMessage: userText,
        chatId,
      });

      if (!chatId && res.data.chatId) {
        localStorage.setItem("chatId", res.data.chatId);
        setActiveChat(res.data.chatId);
        onChatCreated?.();
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error getting response",
        },
      ]);
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* 💬 CHAT */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[70%] p-3 rounded text-sm ${
              m.role === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ⭐ STARTER MESSAGES (DYNAMIC ALIGNMENT) */}
      {!chatId && starterMessages.length > 0 && (
        <div className="mb-3 flex justify-center">
          <div className="flex flex-wrap gap-2 max-w-[80%]">
            {starterMessages.map((s) => (
              <button
                key={s._id}
                type="button"
                onClick={() => toggleStarter(s.text)}
                className={`px-4 py-2 text-xs rounded-full border transition whitespace-nowrap
            ${
              selectedStarters.includes(s.text)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
              >
                {s.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ✍ INPUT */}
      <form onSubmit={send} className="flex gap-2">
        <textarea
          value={input}
          onChange={handleChange}
          rows={2}
          placeholder="Type your message..."
          className="flex-1 border rounded p-2 resize-none focus:outline-none"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
