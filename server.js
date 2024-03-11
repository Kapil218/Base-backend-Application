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
let room1Chat = [];
let room2Chat = [];
let room3Chat = [];
let currRoom = 1;
function sendData() {
  let dataToSend;
  if (currRoom == 1) {
    dataToSend = room1Chat;
  } else if (currRoom == 2) {
    dataToSend = room2Chat;
  } else if (currRoom == 3) {
    dataToSend = room3Chat;
  }
  // Now emit the data to the client
  console.log("dataToSend", dataToSend);
  return dataToSend;
}
// Socket.IO event handling
io.on("connection", function (socket) {
  console.log("Socket connected");
  // Assigning Room to User and sending Room chats
  socket.on("joinRoom", function (data) {
    currRoom = data;
    socket.emit("getData", sendData());
  });
  // Storing chats
  socket.on("storeChats", function (data) {
    if (currRoom == 1) {
      room1Chat.push(data);
      console.log("room 1", room1Chat);
    } else if (currRoom == 2) {
      room2Chat.push(data);
      console.log("room 2", room2Chat);
    } else if (currRoom == 3) {
      room3Chat.push(data);
      console.log("room 3", room3Chat);
    }
  });
  socket.on("disconnect", function () {
    console.log("Socket disconnected");
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));

//--------------------------------------------------------------
// 1.  brodcast to all users
// io.emit("brodcast", { message:  "message for all" });
// 2. Sending Messages to the Sender only (using custom events)
// socket.emit("brodcast", { message: `HIi Welcome` });
// 3. Sending Messages to Everyone Except the Sender
// socket.broadcast.emit("brodcast", { message: `message for all except sender` });
//---------------------------------------------------------------------
// broadcast to all connected clients except those in the room
// io.except("roomName").emit("hello", "world not in room");
//---------------------------------------------------------------
// broadcast to all connected clients in the room
// io.to("roomName").emit("hello", "world");
