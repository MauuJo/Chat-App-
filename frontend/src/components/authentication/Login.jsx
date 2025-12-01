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
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Snackbar State (Replaces Chakra useToast)
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // success, error, warning, info

  const navigate = useNavigate();
  const { setUser } = ChatState();

  const handleClick = () => setShow(!show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Helper to show toast/snackbar
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
    setLoading(true);
    if (!email || !password) {
      showToast("Please Fill all the Fields", "warning");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      showToast("Login Successful", "success");
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      showToast(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Error Occured!",
        "error"
      );
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Email Address"
        variant="outlined"
        required
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Your Email Address"
      />

      <FormControl variant="outlined" required fullWidth>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClick}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          placeholder="Enter password"
        />
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </Button>

      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
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

export default Login;