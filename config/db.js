const mongoose = require("mongoose");

async function connectDB() {
  try {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`DB connected !`);
  } catch (error) {
    console.log(`Error Connecting DataBase :${error}`);
  }
}

module.exports = {connectDB};
