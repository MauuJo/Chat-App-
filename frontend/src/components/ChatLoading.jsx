import React from "react";
import { Skeleton, Stack } from "@mui/material";

const ChatLoading = () => {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rectangular" height={45} animation="wave" />
      <Skeleton variant="rectangular" height={45} animation="wave" />
      <Skeleton variant="rectangular" height={45} animation="wave" />
      <Skeleton variant="rectangular" height={45} animation="wave" />
      <Skeleton variant="rectangular" height={45} animation="wave" />
      <Skeleton variant="rectangular" height={45} animation="wave" />
      <Skeleton variant="rectangular" height={45} animation="wave" />
      <Skeleton variant="rectangular" height={45} animation="wave" />
      <Skeleton variant="rectangular" height={45} animation="wave" />
      <Skeleton variant="rectangular" height={45} animation="wave" />
      <Skeleton variant="rectangular" height={45} animation="wave" />
      <Skeleton variant="rectangular" height={45} animation="wave" />
    </Stack>
  );
};

export default ChatLoading;