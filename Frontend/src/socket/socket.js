// src/socket/socket.js
import { io } from "socket.io-client";
const socket = io("http://localhost:3000"); // ✅ Update if using deployed server
export default socket;
