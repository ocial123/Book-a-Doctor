const mongoose = require("mongoose");

const connectToDB = async () => {
  const connStr = process.env.MONGO_DB;
  
  if (connStr) {
    try {
      console.log("Attempting to connect to MongoDB Atlas...");
      await mongoose.connect(connStr, {
        serverSelectionTimeoutMS: 8000, // 8s timeout for remote Atlas
      });
      console.log(`MongoDB Connected successfully to host: ${mongoose.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB Atlas connection error: ${error.message}`);
    }
  }

  // Fallback to local or embedded in-memory database
  try {
    console.log("Attempting local MongoDB connection...");
    await mongoose.connect("mongodb://127.0.0.1:27017/medicare_db", {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`Local MongoDB Connected successfully: ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`Local MongoDB unavailable (${error.message}). Starting embedded memory server...`);
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`Embedded MongoDB Server Connected successfully: ${mongoUri}`);
    } catch (fallbackErr) {
      console.error("Failed to connect to fallback database:", fallbackErr);
    }
  }
};

module.exports = connectToDB;

