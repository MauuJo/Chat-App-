import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

// MUI Components
import {
  Box,
  Button,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  Badge
} from "@mui/material";

// MUI Icons
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Menu State for Notifications
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  // Menu State for Profile
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(profileAnchorEl);

  // Snackbar State
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const navigate = useNavigate();

  // --- Handlers ---

  const showToast = (message, severity = "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleSearch = async () => {
    if (!search) {
      showToast("Please Enter something in search", "warning");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      showToast("Failed to Load the Search Results", "error");
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setIsDrawerOpen(false); // Close drawer
    } catch (error) {
      showToast(error.message, "error");
      setLoadingChat(false);
    }
  };

  // --- Render ---

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "white",
          width: "100%",
          p: "5px 10px",
          borderWidth: "5px",
        }}
      >
        {/* Search Button */}
        <Tooltip title="Search Users to chat" arrow placement="bottom-end">
          <Button variant="text" onClick={toggleDrawer(true)}>
            <SearchIcon />
            <Typography
              sx={{ display: { xs: "none", md: "flex" }, px: 2 }}
            >
              Search User
            </Typography>
          </Button>
        </Tooltip>

        {/* Title */}
        <Typography variant="h6" sx={{ fontFamily: "Work sans" }}>
          Chat App
        </Typography>

        {/* Right Side Menus */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          
          {/* Notification Menu */}
          <IconButton 
            onClick={(e) => setNotificationAnchorEl(e.currentTarget)}
            size="large"
          >
            <Badge badgeContent={notification.length} color="error">
             <NotificationsIcon />
            </Badge>
            {/* Note: react-notification-badge is deprecated/older. MUI Badge is preferred.
                If you really want the animation, keep NotificationBadge logic, but MUI Badge is standard. */}
          </IconButton>

          <Menu
            anchorEl={notificationAnchorEl}
            open={isNotificationMenuOpen}
            onClose={() => setNotificationAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {!notification.length && <MenuItem onClick={() => setNotificationAnchorEl(null)}>No New Messages</MenuItem>}
            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                  setNotificationAnchorEl(null);
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </Menu>

          {/* Profile Menu */}
          <Button
            onClick={(e) => setProfileAnchorEl(e.currentTarget)}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ ml: 1, bgcolor: "white", color: 'black', '&:hover': { bgcolor: '#f0f0f0'} }}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt={user.name}
              src={user.pic}
            />
          </Button>

          <Menu
            anchorEl={profileAnchorEl}
            open={isProfileMenuOpen}
            onClose={() => setProfileAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {/* We wrap MenuItem with ProfileModal so clicking it opens the modal */}
            <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            
            <Divider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Drawer for Search */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ width: 300, p: 2 }} role="presentation">
          <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: "1px solid #ddd" }}>
            Search Users
          </Typography>
          
          <Box sx={{ display: "flex", pb: 2 }}>
            <TextField
              placeholder="Search by name or email"
              fullWidth
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button onClick={handleSearch} variant="contained" disableElevation>Go</Button>
          </Box>

          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}

          {loadingChat && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />}
        </Box>
      </Drawer>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SideDrawer;