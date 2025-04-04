// scripts/checkDb.js
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
  try {
    const connectionOptions = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log(`Attempting to connect to MongoDB at: ${process.env.MONGO_URI}`);
    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    
    // Get reference to the database
    const db = mongoose.connection.db;
    console.log(`✅ MongoDB Connected to database: ${mongoose.connection.name}`);
    
    // Check if collections exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log("📋 Available collections:", collectionNames.join(', ') || 'None yet');
    
    return true;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error("\nTROUBLESHOOTING TIPS:");
      console.error("1. Ensure MongoDB is installed and running on your machine");
      console.error("2. Check if the MongoDB service is running:");
      console.error("   - On Windows: Check Services app or run 'net start MongoDB'");
      console.error("   - On Linux/Mac: Run 'sudo systemctl status mongodb' or 'brew services list'");
      console.error("3. Try connecting to a MongoDB Atlas cloud database instead");
      console.error("   - Update your MONGO_URI in .env file with an Atlas connection string");
    } else if (error.message.includes('connection timed out')) {
      console.error("\nTROUBLESHOOTING TIPS:");
      console.error("1. Check your network connection");
      console.error("2. Make sure your MongoDB Atlas IP whitelist includes your current IP");
      console.error("3. Check if the cluster name in your connection string is correct");
    } else if (error.message.includes('authentication failed')) {
      console.error("\nTROUBLESHOOTING TIPS:");
      console.error("1. Check if the username and password in your connection string are correct");
      console.error("2. Make sure the user has access to the database");
    }
    
    return false;
  }
}

// Create a default admin user if none exists
async function createDefaultAdmin() {
  try {
    const adminCount = await Admin.countDocuments();
    console.log(`Current admin count: ${adminCount}`);
    
    if (adminCount === 0) {
      // Create a default admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const admin = new Admin({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'Super Admin'
      });
      
      await admin.save();
      console.log("✅ Default admin user created:");
      console.log("   Email: admin@example.com");
      console.log("   Password: admin123");
      
      // Verify the admin was saved
      const verifyAdmin = await Admin.findOne({ email: 'admin@example.com' });
      if (verifyAdmin) {
        console.log("   Admin verified in database with ID:", verifyAdmin._id);
      } else {
        console.error("   ❌ Could not verify admin was saved!");
      }
    } else {
      console.log(`✅ ${adminCount} admin users already exist in the database`);
      // List existing admins for verification
      const admins = await Admin.find({}, 'name email role');
      console.log("   Existing admins:", admins.map(a => `${a.name} (${a.email})`).join(', '));
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  }
}

// Create some sample students if none exist
async function createSampleStudents() {
  try {
    const studentCount = await Student.countDocuments();
    console.log(`Current student count: ${studentCount}`);
    
    if (studentCount === 0) {
      // Create some sample students
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('student123', salt);
      
      const students = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: hashedPassword,
          rollNo: '21CS1001',
          batch: '2021-2025',
          branch: 'CSE',
          bio: 'Computer Science student passionate about web development.',
          skills: 'JavaScript, React, Node.js',
          interests: 'Web Development, AI',
          status: 'active'
        }
      ];
      
      const result = await Student.insertMany(students);
      console.log(`✅ ${result.length} sample students created with IDs:`, result.map(s => s._id));
      console.log("   All with password: student123");
      
      // Verify students were saved
      const verifyStudents = await Student.find({}, 'name email rollNo');
      if (verifyStudents.length === students.length) {
        console.log("   Students verified in database.");
      } else {
        console.error(`   ❌ Expected ${students.length} students but found ${verifyStudents.length}!`);
      }
    } else {
      console.log(`✅ ${studentCount} students already exist in the database`);
      // List a few students for verification
      const students = await Student.find({}).limit(5);
      console.log("   Sample students:", students.map(s => `${s.name} (${s.rollNo})`).join(', '));
    }
  } catch (error) {
    console.error("❌ Error creating sample students:", error.message);
    console.error(error.stack);
  }
}

// Main function
async function main() {
  console.log("\n=== CONNECTION FOLIO DATABASE CHECK ===\n");
  
  // Try to connect to the database
  const connected = await connectDB();
  
  if (connected) {
    try {
      // Check and create default users
      await createDefaultAdmin();
      await createSampleStudents();
      
      // Final verification of collections
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      console.log("\n✅ Final database verification:");
      console.log(`   Database name: ${mongoose.connection.name}`);
      console.log(`   Collections: ${collectionNames.join(', ')}`);
      
      if (!collectionNames.includes('admins')) {
        console.error("   ❌ Warning: 'admins' collection not found!");
      }
      
      if (!collectionNames.includes('students')) {
        console.error("   ❌ Warning: 'students' collection not found!");
      }
      
      console.log("\n✅ Database check complete");
    } catch (error) {
      console.error("\n❌ Error during database operations:", error.message);
    }
  }
  
  // Disconnect and exit
  await mongoose.disconnect();
  console.log("\n👋 MongoDB connection closed");
  process.exit(connected ? 0 : 1);
}

// Run the main function
main(); 