import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./src/config/database";
import User from "./src/models/user.model";

// Load environment variables
dotenv.config();

const testUserWithAddress = {
  firstname: "Test",
  lastname: "User",
  password: "password123",
  address: {
    street: "123 Main Street",
    building: "A",
    apartment: "4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  },
  phoneNumber: "+1234567890",
  email: "test.address@example.com",
  healthConditions: [],
  allergies: []
};

async function testAddressFields() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();

    console.log("🧹 Clearing existing test user...");
    await User.deleteMany({ email: testUserWithAddress.email });

    console.log("👤 Creating test user with building/apartment...");
    const createdUser = await User.create(testUserWithAddress);

    console.log("✅ Test user created successfully!");
    console.log(`Name: ${createdUser.fullName}`);
    console.log(`Email: ${createdUser.email}`);
    console.log(`Full Address: ${createdUser.fullAddress}`);
    console.log(`Address Details:`);
    console.log(`  Street: ${createdUser.address.street}`);
    console.log(`  Building: ${createdUser.address.building || 'N/A'}`);
    console.log(`  Apartment: ${createdUser.address.apartment || 'N/A'}`);
    console.log(`  City: ${createdUser.address.city}`);
    console.log(`  State: ${createdUser.address.state}`);
    console.log(`  ZIP: ${createdUser.address.zipCode}`);
    console.log(`  Country: ${createdUser.address.country}`);

    // Test without building/apartment
    const testUserWithoutOptional = {
      firstname: "Test",
      lastname: "User2",
      password: "password123",
      address: {
        street: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "United States"
      },
      phoneNumber: "+1987654321",
      email: "test.address2@example.com",
      healthConditions: [],
      allergies: []
    };

    console.log("\n👤 Creating test user without building/apartment...");
    const createdUser2 = await User.create(testUserWithoutOptional);
    console.log(`Full Address: ${createdUser2.fullAddress}`);

  } catch (error) {
    console.error("❌ Error testing address fields:", error);
  } finally {
    console.log("🔌 Disconnecting from MongoDB...");
    await disconnectDB();
    process.exit(0);
  }
}

// Run the test
testAddressFields(); 