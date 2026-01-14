// src/server.js
const app = require("./app.js");
require("dotenv").config();

require("./config/mongoose.config");

const PORT = process.env.PORT;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
