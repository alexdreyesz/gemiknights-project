// Simple test script to demonstrate login functionality
// Run this after starting the server

const testLogin = async () => {
  const baseUrl = "http://localhost:3000/api";

  // First, create a test user
  const createUserResponse = await fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    }),
  });

  if (createUserResponse.ok) {
    console.log("✅ User created successfully");

    // Test login with email
    const loginWithEmailResponse = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: "john.doe@example.com",
        password: "password123",
      }),
    });

    if (loginWithEmailResponse.ok) {
      const loginData = await loginWithEmailResponse.json();
      console.log("✅ Login with email successful");
      console.log("Token:", loginData.token);

      // Test login with phone number
      const loginWithPhoneResponse = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: "+1234567890",
          password: "password123",
        }),
      });

      if (loginWithPhoneResponse.ok) {
        console.log("✅ Login with phone number successful");

        // Test protected route
        const profileResponse = await fetch(`${baseUrl}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${loginData.token}`,
          },
        });

        if (profileResponse.ok) {
          console.log("✅ Protected route access successful");
        } else {
          console.log("❌ Protected route access failed");
        }
      } else {
        console.log("❌ Login with phone number failed");
      }
    } else {
      console.log("❌ Login with email failed");
    }
  } else {
    console.log("❌ User creation failed");
  }
};

// Run the test
testLogin().catch(console.error);
