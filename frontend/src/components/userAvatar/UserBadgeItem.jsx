import React from "react";
import { Chip } from "@mui/material";
// CloseIcon is automatically handled by the 'onDelete' prop in Chip, 
// but we can import it if we want to customize it.

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Chip
      // The label contains the Name and optional (Admin) text
      label={`${user.name}${admin === user._id ? " (Admin)" : ""}`}
      
      // onDelete adds the 'X' icon automatically and triggers the function
      onDelete={handleFunction}
      
      // We also add onClick to the body to match original behavior (clicking anywhere removes it)
      onClick={handleFunction}
      
      variant="filled"
      sx={{
        m: 0.5,
        mb: 1,
        borderRadius: 2, // Adds the rounded look
        fontSize: 12,
        cursor: "pointer",
        bgcolor: "purple", // Matching Chakra's colorScheme="purple"
        color: "white",
        fontWeight: "bold",
        textTransform: "capitalize",
        // Custom styling for the delete 'X' icon to make it white
        "& .MuiChip-deleteIcon": {
          color: "white",
          "&:hover": {
            color: "#e0e0e0",
          },
        },
        // Hover effect for the whole chip
        "&:hover": {
          bgcolor: "#6a1b9a", // Darker purple
        },
      }}
    />
  );
};

export default UserBadgeItem;