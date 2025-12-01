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

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip title={m.sender.name} placement="bottom-start" arrow>
                <Avatar
                  sx={{
                    mt: "7px",
                    mr: 1,
                    width: 32, // Equivalent to size="sm"
                    height: 32,
                    cursor: "pointer",
                  }}
                  alt={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                display: "inline-block", // Ensures padding works correctly
                fontFamily: "Work sans, sans-serif",
                fontSize: "14px",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;