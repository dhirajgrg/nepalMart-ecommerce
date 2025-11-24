import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Connect to backend Socket.IO server
const socket = io("http://localhost:3000"); // use your backend port

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Receive full chat history on connection
    socket.on("history", (history) => {
      // Map backend message structure to frontend-friendly
      const formatted = history.map((msg) => ({
        role: msg.role === "model" ? "receiver" : "sender",
        message: msg.parts[0].text,
        timestamp:
          msg.timestamp ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
      }));
      setMessages(formatted);
    });

    // Receive new AI responses
    socket.on("response", (msg) => {
      const newMsg = {
        role: "receiver",
        message: msg,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off("history");
      socket.off("response");
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    // Send message to backend
    socket.emit("message", input);

    // Display immediately in UI
    const newMsg = {
      role: "sender",
      message: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-bubble ${msg.role}`}>
            <div className="message-text">{msg.message}</div>
            <div className="timestamp">{msg.timestamp}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
