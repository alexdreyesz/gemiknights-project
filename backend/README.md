# Backend API with Authentication

This backend provides user management and authentication functionality with support for login using either email or phone number.

## Features

- User registration and management
- Login with email or phone number + password
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `example.env`:

```bash
cp example.env .env
```

3. Set your JWT secret in the `.env` file:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Start the server:

```bash
npm start
```

## API Endpoints

### Authentication

#### POST /api/auth/login

Login with email or phone number and password.

**Request Body:**

```json
{
  "identifier": "user@example.com", // or phone number
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "firstname": "John",
    "lastname": "Doe",
    "fullName": "John Doe",
    "email": "user@example.com",
    "phoneNumber": "+1234567890"
    // ... other user fields
  }
}
```

#### GET /api/auth/profile

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

### User Management

#### POST /api/users

Create a new user.

#### GET /api/users

Get all users with pagination and filtering.

#### GET /api/users/:id

Get user by ID.

#### PUT /api/users/:id

Update user.

## Testing

Run the test script to verify login functionality:

```bash
node test-login.js
```

This will:

1. Create a test user
2. Test login with email
3. Test login with phone number
4. Test protected route access

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens expire after 7 days
- Protected routes require valid JWT token
- Input validation and sanitization
- Error handling with appropriate HTTP status codes
