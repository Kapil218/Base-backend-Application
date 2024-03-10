import express from "express";
import dotenv from "dotenv";
import data from "./data/data.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connect } from "tls";

const app = express();
app.use(cors());
dotenv.config();

const server = http.createServer(app); // Create HTTP server using Express
const io = new Server(server); // Attach Socket.IO to the HTTP server

app.get("/", (req, res) => res.send("You are asking for data"));
app.get("/api/v1/chats/", (req, res) => res.send(data));
app.get("/api/v1/chats/:id/", (req, res) => {
  const singleChat = data.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

// the following function will run when the connection is established
io.on("connection", function (socket) {
  console.log("Socket connected");
  socket.on("disconnect", function () {
    console.log("Socket disconnected");
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));
