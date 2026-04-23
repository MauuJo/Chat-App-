import React from "react";
import { Avatar, Tooltip } from "@mui/material";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  // BULLETPROOF FORMATTER: Prevents crashes if text is missing
  const formatMessageText = (text) => {
    if (!text || typeof text !== "string") return text;
    
    const parts = text.split(/(@ai)/gi);
    return parts.map((part, index) => 
      part.toLowerCase() === "@ai" ? (
        <span key={index} style={{ 
          fontWeight: "bold", 
          color: "#D6BCFA", // Light purple so it shows well on dark/light backgrounds
          backgroundColor: "rgba(0,0,0,0.2)", 
          padding: "2px 4px",
          borderRadius: "4px"
        }}>
          {part}
        </span>
      ) : (
        part 
      )
    );
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          // BULLETPROOF CHECK: Uses '?.' so it gracefully fails instead of crashing
          const isAI = m?.content?.startsWith("🤖 AI");

          return (
            <div 
              style={{ 
                display: "flex", 
                justifyContent: isAI ? "center" : "flex-start",
                width: "100%" 
              }} 
              key={m._id || i}
            >
              {!isAI && (isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip title={m?.sender?.name || "User"} placement="bottom-start" arrow>
                  <Avatar
                    sx={{ mt: "7px", mr: 1, width: 32, height: 32, cursor: "pointer" }}
                    alt={m?.sender?.name || "User"}
                    src={m?.sender?.pic}
                  />
                </Tooltip>
              )}

              <span
                style={{
                  backgroundColor: isAI 
                    ? "#2D3748" 
                    : m?.sender?._id === user._id ? "#BEE3F8" : "#B9F5D0",
                  color: isAI ? "#FFFFFF" : "#000000",
                  marginLeft: isAI ? "auto" : isSameSenderMargin(messages, m, i, user._id),
                  marginRight: isAI ? "auto" : 0,
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: isAI ? "8px" : "20px",
                  padding: isAI ? "12px 20px" : "5px 15px",
                  maxWidth: isAI ? "85%" : "75%",
                  display: "inline-block",
                  fontFamily: isAI ? "monospace, sans-serif" : "Work sans, sans-serif",
                  fontSize: "14px",
                  whiteSpace: "pre-wrap", 
                  boxShadow: isAI ? "0 4px 6px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {formatMessageText(m?.content)}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;