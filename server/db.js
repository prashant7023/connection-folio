// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const connectionOptions = {
      // Recommended options for stable connection
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    console.log(`Attempting to connect to MongoDB at: ${process.env.MONGO_URI}`);
    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    
    // Create explicit reference to the database
    const db = mongoose.connection.db;
    
    console.log(`✅ MongoDB Connected: ${mongoose.connection.name}`);
    
    // Log available collections to verify they exist
    const collections = await db.listCollections().toArray();
    console.log("📋 Available collections:", collections.map(c => c.name).join(', ') || 'None yet');
    
    return true;
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error("\nTROUBLESHOOTING TIPS:");
      console.error("1. Ensure MongoDB is installed and running on your machine");
      console.error("2. Check if the MongoDB service is running:");
      console.error("   - On Windows: Check Services app or run 'net start MongoDB'");
      console.error("   - On Linux/Mac: Run 'sudo systemctl status mongodb' or 'brew services list'");
      console.error("3. Verify your connection string in .env is correct");
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
