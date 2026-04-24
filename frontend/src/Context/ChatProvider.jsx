import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const validateUser = () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!userInfo || !userInfo.token) {
          localStorage.removeItem("userInfo");
          setAuthChecked(true);
          navigate("/");
          return;
        }

        // Check if token is expired by decoding JWT payload
        const tokenPayload = JSON.parse(atob(userInfo.token.split(".")[1]));
        const isExpired = tokenPayload.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("userInfo");
          setUser(null);
          setAuthChecked(true);
          navigate("/");
          return;
        }

        // Token is valid and not expired
        setUser(userInfo);
        setAuthChecked(true);

        // Navigate to chats only if on login page
        if (window.location.pathname === "/") {
          navigate("/chats");
        }

      } catch (error) {
        // If anything goes wrong parsing, clear and redirect
        localStorage.removeItem("userInfo");
        setUser(null);
        setAuthChecked(true);
        navigate("/");
      }
    };

    validateUser();
  }, [navigate]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        setUser(null);
        navigate("/");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  if (!authChecked) {
    return null;
  }

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;