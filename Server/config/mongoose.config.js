const mongoose = require("mongoose");
const username = process.env.ATLAS_USERNAME;
const password = process.env.ATLAS_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const uri = `mongodb+srv://${username}:${password}@testproject.l3pmxx6.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB");
  });
