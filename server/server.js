const dotenv = require("dotenv");
const app = require("./src/app");
const connectToDB = require("./src/config/db");
const { createServer } = require("http");
const socketUtil = require("./src/utils/socket");

dotenv.config();
connectToDB();

const httpServer = createServer(app);
socketUtil.init(httpServer, {});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () =>
  console.log(`✅ server is listening on PORT : ${PORT}`),
);
