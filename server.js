import express from "express";
import dotenv from "dotenv";
import data from "./data/data.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

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

let roomChats = [];

// Socket.IO event handling
io.on("connection", function (socket) {
  console.log("Socket connected");
  io.emit(
    "avlRooms",
    roomChats.map((chat) => chat.gName)
  ); // Broadcast updated list of available rooms
  // Create a new room
  socket.on("createRoom", function (room) {
    if (!roomChats.some((chat) => chat.gName === room)) {
      roomChats.push({ gName: room, chat: [] });
      io.emit(
        "avlRooms",
        roomChats.map((chat) => chat.gName)
      ); // Broadcast updated list of available rooms
    }
  });

  // Join a room
  socket.on("joinRoom", function (room) {
    const targetRoom = roomChats.find((chat) => chat.gName === room);
    if (targetRoom) {
      socket.join(room); // Join the specified room
      socket.emit("getData", targetRoom.chat); // Emit existing chat data for the room
    } else {
      // Handle error: Room does not exist
      socket.emit("error", "Room does not exist");
    }
  });

  // Store Chats
  socket.on("storeChats", function (data) {
    const roomName = data.roomName;
    const chat = data.chat;
    const targetRoom = roomChats.find((chats) => chats.gName === roomName);
    if (!targetRoom || !chat.text) {
      // Handle error: Invalid message data or room does not exist
      socket.emit("error", "Invalid message data or room does not exist");
    } else {
      // Store message in the appropriate room's chat array
      targetRoom.chat.push({ chat });
      // Emit updated chat data to all clients in the room
      io.to(roomName).emit("getData", targetRoom.chat);
    }
  });

  socket.on("disconnect", function () {
    console.log("Socket disconnected");
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));
