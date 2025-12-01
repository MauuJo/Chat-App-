import React from 'react';
import { Route, Routes } from 'react-router-dom'; // 1. Import Routes
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage'; // 2. Import your ChatPage

function App() {
  return (
    
    <div className="App">
      {/* 3. Wrap EVERYTHING in <Routes> */}
      <Routes>
        
        {/* 4. Use 'element' prop with JSX syntax: <Homepage /> */}
        <Route path="/" element={<Homepage />} />
        
        {/* 5. Add the route for the chat page */}
        <Route path="/chats" element={<ChatPage />} />
        
      </Routes>
    </div>
  );
}

export default App;