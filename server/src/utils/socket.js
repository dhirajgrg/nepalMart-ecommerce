const { Server } = require("socket.io");
const generateResponse = require("../services/aiServices");
const { jwtTokenVerify } = require("./jwtHelper");
const User = require("../models/usersModels");
const Order = require("../models/orderModels");

let ioInstance;

const init = (httpServer, opts = {}) => {
  ioInstance = new Server(httpServer, opts);

  ioInstance.on("connection", async (socket) => {
    console.log("socket connected", socket.id);

    // try to authenticate user from handshake.auth.token
    try {
      const token = socket.handshake?.auth?.token;
      if (token) {
        const decoded = await jwtTokenVerify(token);
        const user = await User.findById(decoded.id)
          .select("_id role store")
          .lean();
        if (user) {
          socket.user = user;
          // auto-join user's personal room
          socket.join(`user_${user._id}`);
          if (user.role === "vendor" && user.store)
            socket.join(`store_${user.store}`);
          if (user.role === "rider") socket.join(`rider_${user._id}`);
        }
      }
    } catch (err) {
      console.warn("Socket auth failed:", err.message);
    }

    socket.on("disconnect", () => {
      console.log("socket disconnected", socket.id);
    });

    socket.on("joinOrder", async (orderId) => {
      try {
        if (!socket.user)
          return socket.emit(
            "error",
            "Authentication required to join order room",
          );
        if (!orderId) return;
        const order = await Order.findById(orderId)
          .select("_id customer store rider")
          .lean();
        if (!order) return socket.emit("error", "Order not found");

        const userId = socket.user._id.toString();
        const isCustomer = order.customer.toString() === userId;
        const isStoreOwner =
          socket.user.role === "vendor" &&
          socket.user.store &&
          socket.user.store.toString() === order.store.toString();
        const isAssignedRider =
          socket.user.role === "rider" &&
          order.rider &&
          order.rider.toString() === userId;

        if (isCustomer || isStoreOwner || isAssignedRider) {
          socket.join(orderId.toString());
        } else {
          socket.emit("error", "Not authorized to join this order room");
        }
      } catch (err) {
        console.error("joinOrder error", err.message);
      }
    });

    socket.on("joinUser", (userId) => {
      if (!socket.user) return socket.emit("error", "Authentication required");
      // allow joining only your own user room
      if (socket.user._id.toString() === userId.toString())
        socket.join(`user_${userId}`);
    });

    socket.on("message", async (msg) => {
      // simple AI chat passthrough preserved from original server
      try {
        const chatHistory = [{ role: "user", parts: [{ text: msg }] }];
        const aiResponse = await generateResponse(chatHistory);
        socket.emit("response", aiResponse);
      } catch (err) {
        console.error("AI response error", err);
      }
    });
  });
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized - call init(httpServer) first.");
  }
  return ioInstance;
};

module.exports = { init, getIO };
