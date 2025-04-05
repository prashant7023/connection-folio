// scripts/checkDb.js
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB and check connection
async function checkDatabaseConnection() {
  console.log("\n=== CONNECTION FOLIO DATABASE CHECK ===\n");
  console.log(`Attempting to connect to MongoDB at: ${process.env.MONGO_URI}`);
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      family: 4
    });
    
    const db = mongoose.connection.db;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.name}`);
    
    // List available collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log(`📋 Collections: ${collectionNames.join(', ') || 'None yet'}`);
    
    await mongoose.disconnect();
    console.log("👋 MongoDB connection closed\n");
    
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error("🔍 Check if MongoDB server is running properly");
    }
    return false;
  }
}

// Run check
checkDatabaseConnection()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error("Unexpected error:", err);
    process.exit(1);
  }); 