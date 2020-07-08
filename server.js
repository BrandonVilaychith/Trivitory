// Imports
require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db");

// Express app initialization
const app = express();

// Mongo Database Connect
connectDB();

// Middle ware
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Express API Running"));

// Finds port to use
const PORT = process.env.PORT || 7000;

// Starts Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
