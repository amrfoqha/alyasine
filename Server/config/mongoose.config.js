const mongoose = require("mongoose");
const username = process.env.ATLAS_USERNAME;
const password = process.env.ATLAS_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const uri = `mongodb+srv://${username}:${password}@testproject.l3pmxx6.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

mongoose
  .connect(uri, options)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    // Exit process if connection fails initially in production
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  });

// Handle connection errors after initial connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Attempting to reconnect...");
});
