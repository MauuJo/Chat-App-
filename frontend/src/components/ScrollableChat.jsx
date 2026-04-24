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

  const formatMessageText = (text) => {
    if (!text || typeof text !== "string") return text;
    const parts = text.split(/(@ai)/gi);
    return parts.map((part, index) =>
      part.toLowerCase() === "@ai" ? (
        <span key={index} style={{
          fontWeight: "bold",
          color: "#D6BCFA",
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
          const isAI = m?.content?.startsWith("🤖 AI");
          const senderName = m?.sender?.name || "Deleted User";
          const senderPic = m?.sender?.pic || null;
          const isDeletedUser = !m?.sender?.name;

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
                <Tooltip title={senderName} placement="bottom-start" arrow>
                  {senderPic ? (
                    <Avatar
                      sx={{ mt: "7px", mr: 1, width: 32, height: 32, cursor: "pointer" }}
                      alt={senderName}
                      src={senderPic}
                    />
                  ) : (
                    // Show a grey avatar with ? for deleted users
                    <Avatar
                      sx={{
                        mt: "7px",
                        mr: 1,
                        width: 32,
                        height: 32,
                        cursor: "pointer",
                        bgcolor: "#9E9E9E",
                        fontSize: "14px"
                      }}
                    >
                      ?
                    </Avatar>
                  )}
                </Tooltip>
              )}

              <span
                style={{
                  backgroundColor: isAI
                    ? "#2D3748"
                    : isDeletedUser
                    ? "#E0E0E0"  // Grey background for deleted user messages
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
                {/* Show deleted user label above their messages */}
                {isDeletedUser && !isAI && (
                  <span style={{
                    display: "block",
                    fontSize: "10px",
                    color: "#757575",
                    marginBottom: "2px",
                    fontStyle: "italic"
                  }}>
                    Deleted User
                  </span>
                )}
                {formatMessageText(m?.content)}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;