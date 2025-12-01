import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@mui/material";
import SingleChat from "./SingleChat";
import "./styles.css"; // Ensure this file exists or styles are migrated

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "flex" : "none", md: "flex" },
        alignItems: "center",
        flexDirection: "column",
        p: 3,
        bgcolor: "white",
        width: { xs: "100%", md: "68%" },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.300",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;