const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const connStr = process.env.MONGO_DB || "mongodb://127.0.0.1:27017/medicare_db";
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected successfully: ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`Local MongoDB connection notice: ${error.message}`);
    console.log("Initializing embedded in-memory MongoDB server for seamless execution...");
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`Embedded MongoDB Connected successfully: ${mongoUri}`);
    } catch (fallbackErr) {
      console.error("Failed to connect to fallback database:", fallbackErr);
    }
  }
};

module.exports = connectToDB;
