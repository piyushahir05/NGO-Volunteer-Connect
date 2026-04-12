const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
    },
  });

  // Authenticate socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.role = decoded.role;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  // Handle connection
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.userId);

    // Join personal room
    socket.join(socket.userId);

    // Join conversation room
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });

    // Leave conversation room
    socket.on("leaveConversation", (conversationId) => {
      socket.leave(conversationId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.userId);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId.toString()).emit(event, data);
  }
};

const emitToConversation = (conversationId, event, data) => {
  if (io) {
    io.to(conversationId).emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToConversation,
};