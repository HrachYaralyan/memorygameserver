const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://testUser1:test1@cluster0.4qfyg8c.mongodb.net/memory_game_back?retryWrites=true&w=majority&appName=Cluster0`
    );
    app.listen(PORT, () => console.log(`Server started on PORT :${PORT} `));
  } catch (error) {
    console.log(error, "<--- from app function ");
  }
};

start();
