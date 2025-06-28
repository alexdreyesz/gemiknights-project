import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./src/config/database";
import User from "./src/models/user.model";

// Load environment variables
dotenv.config();

const testUsers = [
  {
    firstname: "John",
    lastname: "Doe",
    password: "password123",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    phoneNumber: "+1234567890",
    email: "john.doe@example.com",
    healthConditions: ["Hypertension", "Diabetes"],
    allergies: ["Peanuts", "Shellfish"],
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    password: "password123",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "United States",
    },
    phoneNumber: "+1987654321",
    email: "jane.smith@example.com",
    healthConditions: ["Asthma"],
    allergies: ["Dairy", "Gluten"],
  },
  {
    firstname: "Mike",
    lastname: "Johnson",
    password: "password123",
    address: {
      street: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "United States",
    },
    phoneNumber: "+1555123456",
    email: "mike.johnson@example.com",
    healthConditions: [],
    allergies: ["Latex"],
  },
];

async function createTestUsers() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();

    console.log("🧹 Clearing existing test users...");
    await User.deleteMany({ email: { $in: testUsers.map((u) => u.email) } });

    console.log("👥 Creating test users...");
    const createdUsers = await User.insertMany(testUsers);

    console.log(`✅ Successfully created ${createdUsers.length} test users:`);
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullName} (${user.email})`);
    });

    console.log("\n🔑 Test login credentials:");
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email} | Password: password123`);
    });
  } catch (error) {
    console.error("❌ Error creating test users:", error);
  } finally {
    console.log("🔌 Disconnecting from MongoDB...");
    await disconnectDB();
    process.exit(0);
  }
}

// Run the script
createTestUsers();
