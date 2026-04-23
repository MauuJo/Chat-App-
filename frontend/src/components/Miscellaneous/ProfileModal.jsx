import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { ChatState } from "../../Context/ChatProvider";

const ProfileModal = ({ user, children }) => {
  const { user: loggedInUser, setUser } = ChatState();
  const navigate = useNavigate(); 
  
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [name, setName] = useState(user?.name || "");
  const [pic, setPic] = useState(user?.pic || "");
  const [loading, setLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false); 
  };

  const isMyProfile = loggedInUser?._id === user?._id;

  const deleteAccountHandler = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
        await axios.delete("/api/user/delete", config);
        
        localStorage.removeItem("userInfo");
        setUser(null);
        navigate("/"); 
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account");
      }
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      alert("Please Select an Image!");
      setPicLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app"); // Make sure this matches your Cloudinary preset
      data.append("cloud_name", "piyushproj");  // Make sure this matches your Cloudinary cloud name

      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString()); 
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      alert("Please Select an Image (JPEG or PNG)!");
      setPicLoading(false);
      return;
    }
  };

  const updateProfileHandler = async () => {
    if (!name) return alert("Name cannot be empty");

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedInUser?.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/user/update",
        { name, pic },
        config
      );

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      setLoading(false);
      setEditMode(false);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
      setLoading(false);
      alert("Failed to update profile");
    }
  };

  if (!user) return null;

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <Button onClick={handleOpen}>Profile</Button>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" sx={{ fontFamily: "Work sans", mb: 3 }}>
            {editMode ? "Edit Profile" : user?.name}
          </Typography>

          <img
            src={editMode ? pic : user?.pic}
            alt={user?.name}
            style={{ borderRadius: "50%", width: "150px", height: "150px", objectFit: "cover", marginBottom: "20px" }}
          />

          {editMode ? (
            <Box sx={{ width: "100%", mb: 2 }}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <Button
                variant="outlined"
                component="label"
                fullWidth
                disabled={picLoading}
                sx={{ mb: 2, height: "56px" }}
              >
                {picLoading ? <CircularProgress size={24} /> : "Upload New Picture"}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg, image/png"
                  onChange={(e) => postDetails(e.target.files[0])}
                />
              </Button>
            </Box>
          ) : (
            <Typography variant="h6" sx={{ fontFamily: "Work sans", mb: 3 }}>
              Email: {user?.email}
            </Typography>
          )}

          {isMyProfile && (
            <Box sx={{ display: "flex", gap: 2, mt: 2, width: "100%", justifyContent: "space-between" }}>
              {editMode ? (
                <>
                  <Button variant="contained" onClick={updateProfileHandler} disabled={loading || picLoading}>
                    {loading ? <CircularProgress size={24} /> : "Save"}
                  </Button>
                  <Button variant="outlined" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" onClick={() => setEditMode(true)}>
                    Edit Profile
                  </Button>
                  <Button variant="outlined" color="error" onClick={deleteAccountHandler}>
                    Delete Account
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ProfileModal;