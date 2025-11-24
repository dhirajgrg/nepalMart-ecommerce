const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error(`error:${error.message}`);
    process.exit(1);
  }
};
module.exports = connectToDB;
