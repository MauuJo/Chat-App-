import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@mui/material";

// Import the components we converted earlier
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {/* 1. Only render SideDrawer if user is logged in */}
      {user && <SideDrawer />}
      
      {/* 2. Main Layout Box */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "91.5vh",
          padding: "10px",
        }}
      >
        {/* 3. Render MyChats and ChatBox side-by-side */}
        {user && <MyChats fetchAgain={fetchAgain} />}
        
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;