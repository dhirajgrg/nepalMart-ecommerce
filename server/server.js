const dotenv = require("dotenv");
const app = require("./src/app");
const connectToDB = require("./src/config/db");

dotenv.config();
connectToDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ server is listening on PORT : ${PORT}`));
