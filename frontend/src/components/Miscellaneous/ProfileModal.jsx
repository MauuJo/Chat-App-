import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleOpen} sx={{ display: "flex" }}>
          <VisibilityIcon />
        </IconButton>
      )}
      
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          // Set fixed height to match original Chakra design (h="410px")
          sx: { height: "410px", justifyContent: "space-between" },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "40px",
            fontFamily: "Work sans",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {user.name}
        </DialogTitle>
        
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            component="img"
            src={user.pic}
            alt={user.name}
            sx={{
              borderRadius: "50%",
              width: "150px",
              height: "150px",
              objectFit: "cover",
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: "28px", md: "30px" },
              fontFamily: "Work sans",
              textAlign: "center",
            }}
          >
            Email: {user.email}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileModal;