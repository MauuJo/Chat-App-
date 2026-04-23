const mongoose = require("mongoose");
const colors = require("colors"); // Make sure 'colors' is in your package.json!

const connectDB = async () => {
  try {
    // 1. Strict Check: Is the variable completely missing?
    if (!process.env.MONGO_URI) {
      console.error("❌ CRITICAL ERROR: MONGO_URI is missing from your .env variables!".red.bold);
      console.error("Ensure your docker-compose.yml is passing the env_file correctly.");
      process.exit(1);
    }

    // 2. Safe Debugging: Did it accidentally load a local database string?
    if (process.env.MONGO_URI.includes("127.0.0.1") || process.env.MONGO_URI.includes("localhost")) {
      console.warn("⚠️ WARNING: Your MONGO_URI is pointing to localhost, NOT Atlas!".yellow.bold);
    }

    // 3. The actual Atlas connection
    // Modern Mongoose (v6+) doesn't need useNewUrlParser or useUnifiedTopology anymore
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected to Atlas: ${conn.connection.host}`.cyan.underline);
    
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`.red.bold);
    process.exit(1); 
  }
};

module.exports = connectDB;