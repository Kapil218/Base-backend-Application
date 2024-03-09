import express from "express";
const app = express();
import dotenv from "dotenv";

dotenv.config();
import data from "./data/data.js";
app.get("/", (req, res) => res.send("you are asking for data"));
app.get("/api/v1/chats/", (req, res) => res.send(data));
app.get("/api/v1/chats/:id/", (req, res) => {
  const singleChat = data.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Hello From srver ${port}`));
