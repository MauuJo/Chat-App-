import React, { useEffect, useState, useRef } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";

// Internal Components
import ProfileModal from "./Miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import { getSender, getSenderFull } from "../config/ChatLogics";
import animationData from "../animations/typing.json";
import "./styles.css";

const ENDPOINT = "http://localhost:5000"; // Adjust if deploying
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  // MOVED INSIDE: All hooks must reside inside the component body
  const [isAILoading, setIsAILoading] = useState(false); 
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  // Snackbar State
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const showToast = (message, severity = "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      showToast("Failed to Load the Messages", "error");
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      const messageText = newMessage;
      const isAICommand = messageText.trim().toLowerCase().startsWith("@ai");
      setNewMessage(""); // Clear input instantly

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      try {
        // STEP 1: ALWAYS send the user's message first
        const { data: userMessage } = await axios.post(
          "/api/message",
          { content: messageText, chatId: selectedChat._id },
          config
        );
        
        socket.emit("new message", userMessage);
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // STEP 2: Trigger AI if requested
        if (isAICommand) {
          setIsAILoading(true); // Turn on the loader

          try {
            // Ask FastAPI for the response
            const { data: aiResponse } = await axios.post(
              "/api/ai",
              { message: messageText, chatId: selectedChat._id },
              config
            );

            // Save the AI's answer to MongoDB
            const { data: finalMessage } = await axios.post(
              "/api/message",
              {
                content: `🤖 AI (${aiResponse.intent}):\n${aiResponse.reply}`,
                chatId: selectedChat._id,
              },
              config
            );

            // Broadcast and display the AI's answer
            socket.emit("new message", finalMessage);
            setMessages((prevMessages) => [...prevMessages, finalMessage]);
          } catch (aiError) {
            console.error("AI Service Error:", aiError);
            showToast("AI is currently unavailable.", "error");
          } finally {
            setIsAILoading(false); // Ensure loader ALWAYS turns off
          }
        }
      } catch (error) {
        console.error("Message Save Error:", error);
        setIsAILoading(false);
        showToast("Failed to send message", "error");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    // 1. Clear the previous timer every time a new key is pressed
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 2. Start a fresh 3-second timer
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 3000);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            sx={{
              fontSize: { xs: "28px", md: "30px" },
              pb: 3,
              px: 2,
              width: "100%",
              fontFamily: "Work sans",
              display: "flex",
              justifyContent: { xs: "space-between" },
              alignItems: "center",
            }}
            component="div"
          >
            <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={() => setSelectedChat("")}
            >
              <ArrowBackIcon />
            </IconButton>

            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 3,
              bgcolor: "#E8E8E8",
              width: "100%",
              height: "100%",
              borderRadius: 2,
              overflowY: "hidden",
            }}
          >
            {loading ? (
              <CircularProgress
                size={80}
                sx={{
                  alignSelf: "center",
                  margin: "auto",
                }}
              />
            ) : (
              <>
                {/* 1. The Scrollable Chat Area & Typing Indicator */}
                <div className="messages" style={{ display: "flex", flexDirection: "column", overflowY: "auto", marginBottom: "10px" }}>
                  <ScrollableChat messages={messages} />
                  
                  {/* NEW POLISHED TYPING INDICATOR */}
                  {istyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '5px', marginBottom: '5px' }}>
                      <div style={{
                        backgroundColor: "#E2E8F0",
                        borderRadius: "20px",
                        padding: "5px 15px",
                        width: "60px",
                        height: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Lottie
                        options={defaultOptions}
                        width={35} 
                        style={{ 
                          marginBottom: 0, 
                          marginLeft: 0 // <-- This is the magic CSS trick!
                        }}
                      />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. THE LOADING STATE - Pinned right above the input box */}
                {isAILoading && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <span style={{ 
                      backgroundColor: "#E2E8F0", 
                      padding: "6px 14px", 
                      borderRadius: "15px", 
                      fontSize: "12px",
                      color: "#4A5568",
                      fontStyle: "italic",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }}>
                      🤖 Generating response...
                    </span>
                  </div>
                )}

                {/* 3. The Input Field (Cleaned up!) */}
                <FormControl
                  onKeyDown={sendMessage}
                  required
                  sx={{ mt: 3 }}
                >
                  <TextField
                    variant="filled"
                    placeholder="Enter a message.."
                    value={newMessage}
                    onChange={typingHandler}
                    fullWidth
                    sx={{
                      bgcolor: "#E0E0E0",
                      "& .MuiFilledInput-root": {
                        bgcolor: "#E0E0E0",
                        "&:hover": {
                          bgcolor: "#d5d5d5",
                        },
                        "&.Mui-focused": {
                          bgcolor: "#d5d5d5",
                        },
                      },
                    }}
                  />
                </FormControl>
              </>
            )}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h4"
            sx={{ pb: 3, fontFamily: "Work sans", textAlign: "center" }}
          >
            Click on a user to start chatting
          </Typography>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
    </>
  );
};

export default SingleChat; // Make sure you don't duplicate this line if it's already at the bottom of your file!