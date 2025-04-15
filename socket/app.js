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
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
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
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(onlineUser);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    // console.log(receiverId, data);
    const receiver = getUser(receiverId);
    if (receiver && receiver.socketId) {
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      console.error(`Receiver not found for ID: ${receiverId}`);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen("4000");

// import { Server } from "socket.io";

// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// let onlineUser = [];

// const addUser = (userId, socketId) => {
//   const userIndex = onlineUser.findIndex((user) => user.userId === userId);

//   if (userIndex !== -1) {
//     // Update socketId if user already exists
//     onlineUser[userIndex].socketId = socketId;
//   } else {
//     // Add new user
//     onlineUser.push({ userId, socketId });
//   }

//   console.log("Online Users:", onlineUser);
// };

// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
//   console.log("User disconnected. Online Users:", onlineUser);
// };

// const getUser = (userId) => {
//   return onlineUser.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//     console.log(`User added: ${userId}, Socket ID: ${socket.id}`);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);

//     if (receiver && receiver.socketId) {
//       io.to(receiver.socketId).emit("getMessage", data);
//     } else {
//       console.error(`Receiver not found for ID: ${receiverId}`);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//     removeUser(socket.id);
//   });
// });

// io.listen(4000);
