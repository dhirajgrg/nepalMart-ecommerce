const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI.replace(
      "<db_password>",
      encodeURIComponent(process.env.DB_PASSWORD)
    );
    const conn = await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`error:${error.message}`);
    process.exit(1);
  }
};
module.exports = connectToDB;
