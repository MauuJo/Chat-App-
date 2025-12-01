import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { 
  Box, 
  Stack, 
  Typography, 
  Button, 
  Snackbar, 
  Alert 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./Miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  // Snackbar State
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const showToast = (message, severity = "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      showToast("Failed to Load the chats", "error");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      sx={{
        // Responsive display: hide on mobile if a chat is selected
        display: { xs: selectedChat ? "none" : "flex", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        bgcolor: "white",
        // Responsive width
        width: { xs: "100%", md: "31%" },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.300",
      }}
    >
      <Box
        sx={{
          pb: 3,
          px: 3,
          fontSize: { xs: "28px", md: "30px" },
          fontFamily: "Work sans",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        My Chats
        <GroupChatModal>
          <Button
            variant="contained" // Makes the button standout
            color="primary" // Or generic "grey" if you prefer the subtle look
            startIcon={<AddIcon />}
            sx={{
              display: "flex",
              fontSize: { xs: "17px", md: "10px", lg: "17px" },
            }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 3,
          bgcolor: "#F8F8F8",
          width: "100%",
          height: "100%",
          borderRadius: 2,
          overflowY: "hidden",
        }}
      >
        {chats ? (
          <Stack 
            spacing={2} 
            sx={{ overflowY: "auto" }} // Allow scrolling inside the stack
          >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                sx={{
                  cursor: "pointer",
                  bgcolor: selectedChat === chat ? "#38B2AC" : "#E8E8E8",
                  color: selectedChat === chat ? "white" : "black",
                  px: 3,
                  py: 2,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: selectedChat === chat ? "#38B2AC" : "#D3D3D3",
                  },
                }}
              >
                <Typography>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
                
                {chat.latestMessage && (
                  <Typography variant="caption" display="block">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>

      {/* Snackbar Component */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyChats;