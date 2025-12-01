import {
  Container,
  Box,
  Typography,
  Paper, // Used for the white, boxed sections
} from "@mui/material";

// Components for Tabs in MUI
import { Tab, Tabs } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab"; // TabContext and TabPanel are often imported from @mui/lab

import { useEffect, useState } from "react";
// Use useNavigate for React Router v6 instead of useHistory
import { useNavigate } from "react-router-dom"; 

// Assuming these components are still correct paths
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";

function Homepage() {
  // 1. React Router v6: Use useNavigate
  const navigate = useNavigate();

  // 2. MUI Tabs: Use state to manage the active tab value
  const [tabValue, setTabValue] = useState("1"); // Use string values for TabContext

  // Handler for changing tabs
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 3. Routing Logic (User Check)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    // Use navigate for redirection
    if (user) navigate("/chats"); 
  }, [navigate]);

  // 4. Component Structure
  return (
    // Chakra Container maxW="xl" centerContent -> MUI Container maxWidth="sm" (or "md") 
    // and margin auto for vertical spacing
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      {/* Box 1: Title Header */}
      <Paper 
        elevation={3} // Adds a subtle shadow/border (like borderWidth="1px")
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 3, // p={3} -> padding: theme.spacing(3)
          bgcolor: "white", // bg="white"
          width: "100%",
          // m="40px 0 15px 0" -> marginTop: 5, marginBottom: 2 (MUI spacing scale)
          mt: 5, 
          mb: 2, 
          borderRadius: "lg", // MUI uses 'borderRadius' directly
          border: "1px solid", // Simulate borderWidth="1px"
          borderColor: 'grey.300', // Optional border color
        }}
      >
        {/* Text fontSize="4xl" fontFamily="Work sans" -> Typography variant="h4" */}
        <Typography 
          variant="h4" 
          component="h1" // Semantically better for a title
          sx={{ fontFamily: "Work sans" }}
        >
          Chat App
        </Typography>
      </Paper>
      
      {/* Box 2: Tabs Container */}
      <Paper
        elevation={3}
        sx={{
          bgcolor: "white",
          width: "100%",
          p: 2, // p={4} is roughly p:2 in MUI TabPanel padding
          borderRadius: "lg",
          border: "1px solid",
          borderColor: 'grey.300',
        }}
      >
        {/* MUI Tabs setup requires TabContext from @mui/lab */}
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth" // Similar to isFitted
              // isFitted variant="soft-rounded" is hard to match exactly; 
              // 'fullWidth' and default styling is used here.
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Login" value="1" />
              <Tab label="Sign Up" value="2" />
            </Tabs>
          </Box>
          
          {/* TabPanels are replaced by TabPanel from @mui/lab */}
          <TabPanel value="1" sx={{ p: 0 }}>
            <Login />
          </TabPanel>
          <TabPanel value="2" sx={{ p: 0 }}>
            <Signup />
          </TabPanel>
          
        </TabContext>
      </Paper>
    </Container>
  );
}

export default Homepage;