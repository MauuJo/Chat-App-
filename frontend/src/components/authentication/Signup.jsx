import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Stack,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  // Snackbar State
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const navigate = useNavigate();

  const handleClick = () => setShow(!show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const showToast = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      showToast("Please Fill all the Fields", "warning");
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      showToast("Passwords Do Not Match", "warning");
      setPicLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      showToast("Registration Successful", "success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/chats");
    } catch (error) {
      showToast(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Error Occured!",
        "error"
      );
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      showToast("Please Select an Image!", "warning");
      setPicLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      
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
      showToast("Please Select an Image (jpeg/png)!", "warning");
      setPicLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Name"
        variant="outlined"
        required
        fullWidth
        placeholder="Enter Your Name"
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        label="Email Address"
        variant="outlined"
        required
        fullWidth
        type="email"
        placeholder="Enter Your Email Address"
        onChange={(e) => setEmail(e.target.value)}
      />

      <FormControl variant="outlined" required fullWidth>
        <InputLabel htmlFor="signup-password">Password</InputLabel>
        <OutlinedInput
          id="signup-password"
          type={show ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClick}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          placeholder="Enter Password"
        />
      </FormControl>

      <FormControl variant="outlined" required fullWidth>
        <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
        <OutlinedInput
          id="confirm-password"
          type={show ? "text" : "password"}
          onChange={(e) => setConfirmpassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClick}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Confirm Password"
          placeholder="Confirm password"
        />
      </FormControl>

      <TextField
        label="Upload your Picture"
        variant="outlined"
        type="file"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          accept: "image/*",
        }}
        onChange={(e) => postDetails(e.target.files[0])}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        disabled={picLoading}
      >
        {picLoading ? "Uploading..." : "Sign Up"}
      </Button>

      {/* Snackbar for Notifications */}
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
    </Stack>
  );
};

export default Signup;