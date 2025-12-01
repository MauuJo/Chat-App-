import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        cursor: "pointer",
        bgcolor: "#E8E8E8",
        "&:hover": {
          bgcolor: "#38B2AC",
          color: "white",
        },
        width: "100%",
        display: "flex",
        alignItems: "center",
        color: "black",
        px: 3,
        py: 2,
        mb: 2,
        borderRadius: 2, // 'lg' in Chakra is roughly 2 or 3 in MUI spacing
      }}
    >
      <Avatar
        sx={{ mr: 2, width: 32, height: 32 }}
        src={user.pic}
        alt={user.name}
      />
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {user.name}
        </Typography>
        <Typography variant="caption" display="block">
          <b>Email : </b>
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;