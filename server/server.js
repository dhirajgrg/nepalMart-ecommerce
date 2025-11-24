const dotenv = require("dotenv");
const app = require("./src/app");
const connectToDB = require("./src/config/db");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/services/aiServices");

dotenv.config();
connectToDB();

const httpServer = createServer(app);
const io = new Server(httpServer, {});
const chatHistory = [];

io.on("connection", (socket) => {
  console.log(" user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("message", async (msg) => {
    chatHistory.push({
      role: "user",
      parts: [{ text: msg }],
    });

    const aiResponse = await generateResponse(chatHistory);

    chatHistory.push({
      role: "model",
      parts: [{ text: aiResponse }],
    });
    socket.emit("response", aiResponse);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () =>
  console.log(`✅ server is listening on PORT : ${PORT}`)
);
