const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");

const generateAIResponse = asyncHandler(async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).send({ message: "Please provide message and chatId" });
  }

  try {
    // 1. Fetch the last 10 messages from this chat for the AI's context
    const history = await Message.find({ chat: chatId })
      .populate("sender", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    // Format history into a readable string (e.g., "John: Hello\nJane: Hi")
    const chat_context = history
      .reverse()
      .map((msg) => `${msg.sender.name}: ${msg.content}`)
      .join("\n");

    // 2. Forward the request to the Python FastAPI Microservice
    // (Using native fetch, available in Node 18+)
    console.log("Connecting to AI at:", process.env.AI_SERVICE_URL);
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/api/ai-command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        chat_id: chatId,
        user_id: req.user._id.toString(), // Injected by your auth middleware
        chat_context: chat_context,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error("FastAPI service responded with an error");
    }

    const aiData = await aiResponse.json();

    // 3. Send the AI's final response back to the frontend
    res.status(200).json(aiData);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to communicate with AI Microservice: " + error.message);
  }
});

module.exports = { generateAIResponse };