import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: [
      "http://localhost:5173",
      "https://fake-estate2-0-front-end-k3yf.vercel.app",
    ],
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log("Online users:", onlineUser);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver?.socketId) {
      io.to(receiver.socketId).emit("getMessage", data);
      io.to(receiver.socketId).emit("newNotification"); 
    } else {
      console.error(`Receiver not found for ID: ${receiverId}`);
    }
  });

  socket.on("typing", ({ chatId, to }) => {
    const receiver = getUser(to);
    if (receiver?.socketId) {
      io.to(receiver.socketId).emit("typing", { chatId });
    }
  });

  socket.on("stopTyping", ({ chatId, to }) => {
    const receiver = getUser(to);
    if (receiver) {
      io.to(receiver.socketId).emit("stopTyping", { chatId });
    }
  });
  

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    removeUser(socket.id);
  });
});

io.listen(4000);
