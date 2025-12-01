import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  // Snackbar State
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const { selectedChat, setSelectedChat, user } = ChatState();

  // Handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const showToast = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      showToast("Failed to Load the Search Results", "error");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName(""); // Clear input after success
    } catch (error) {
      showToast(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Rename Failed",
        "error"
      );
      setRenameLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      showToast("User Already in group!", "error");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      showToast("Only admins can add someone!", "error");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      showToast(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Failed to add user",
        "error"
      );
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      showToast("Only admins can remove someone!", "error");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages(); // Refresh messages if someone left
      setLoading(false);
    } catch (error) {
      showToast(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Failed to remove user",
        "error"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ display: { xs: "flex" } }}>
        <VisibilityIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            fontSize: "35px",
            fontFamily: "Work sans",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {selectedChat.chatName}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* User Badges */}
            <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", pb: 3 }}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            {/* Rename Group */}
            <Box sx={{ display: "flex", width: "100%", mb: 3, gap: 1 }}>
              <TextField
                placeholder="Chat Name"
                variant="outlined"
                fullWidth
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="contained"
                color="success" // 'teal' equivalent
                disabled={renameloading}
                onClick={handleRename}
                sx={{ minWidth: "80px", color: 'white' }}
              >
                {renameloading ? <CircularProgress size={24} color="inherit" /> : "Update"}
              </Button>
            </Box>

            {/* Search User to Add */}
            <TextField
              placeholder="Add User to group"
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {/* Search Results */}
            {loading ? (
              <CircularProgress size={40} />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => handleRemove(user)}
            variant="contained"
            color="error"
          >
            Leave Group
          </Button>
        </DialogActions>
      </Dialog>

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

export default UpdateGroupChatModal;