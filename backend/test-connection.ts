import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

async function testConnection() {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error("❌ MONGODB_URI environment variable is not defined");
      console.log(
        "Please add MONGODB_URI=your_connection_string to your .env file"
      );
      return;
    }

    console.log("🔌 Testing MongoDB connection...");
    console.log("Connection string format check:");

    // Check if it looks like a valid MongoDB URI
    if (
      !mongoURI.startsWith("mongodb://") &&
      !mongoURI.startsWith("mongodb+srv://")
    ) {
      console.error(
        "❌ Invalid MongoDB URI format. Should start with 'mongodb://' or 'mongodb+srv://'"
      );
      return;
    }

    // Mask the password for security
    const maskedURI = mongoURI.replace(/:([^@]+)@/, ":****@");
    console.log(`Connection string: ${maskedURI}`);

    // Test connection with a timeout
    const connection = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connection successful!");
    console.log(
      `Connected to database: ${connection.connection.db.databaseName}`
    );

    // Test a simple operation
    const collections = await connection.connection.db
      .listCollections()
      .toArray();
    console.log(`Found ${collections.length} collections in database`);

    await mongoose.disconnect();
    console.log("✅ Connection test completed successfully");
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:");

    if (error.code === 8000) {
      console.error(
        "🔐 Authentication failed - Check your username and password"
      );
      console.log("Common issues:");
      console.log("1. Username/password in connection string is incorrect");
      console.log("2. User doesn't exist in the database");
      console.log("3. User doesn't have proper permissions");
    } else if (error.code === "ENOTFOUND") {
      console.error("🌐 DNS resolution failed - Check your connection string");
    } else if (error.code === "ECONNREFUSED") {
      console.error(
        "🚫 Connection refused - Check if MongoDB is running and accessible"
      );
    } else if (error.message?.includes("timeout")) {
      console.error(
        "⏰ Connection timeout - Check your network and MongoDB server"
      );
    } else {
      console.error("Error details:", error.message);
    }

    console.log("\n🔧 Troubleshooting steps:");
    console.log("1. Verify your MongoDB Atlas credentials");
    console.log("2. Check if your IP is whitelisted in MongoDB Atlas");
    console.log("3. Ensure the database user has proper permissions");
    console.log("4. Double-check your connection string format");
  }
}

testConnection();
