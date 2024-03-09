import express from "express";
import dotenv from "dotenv";
import data from "./data/data.js";
import cors from "cors";

const app = express();
// for connecting frontend n backend
app.use(cors());
// using node variables
dotenv.config();
// api calls handling
app.get("/", (req, res) => res.send("you are asking for data"));
app.get("/api/v1/chats/", (req, res) => res.send(data));
app.get("/api/v1/chats/:id/", (req, res) => {
  const singleChat = data.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Hello From srver ${port}`));
