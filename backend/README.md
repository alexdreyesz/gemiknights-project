# Backend API

This is the backend API for the emergency response application.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `example.env`:

```bash
cp example.env .env
```

3. Configure your environment variables in `.env`:
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `GEMINI_API_KEY`: Your Google Gemini API key (see setup instructions below)

## Google Gemini API Setup

To enable AI-powered emergency analysis, you need to set up Google Gemini:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the API key to your `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

The Gemini API is used to analyze user health conditions and allergies to provide intelligent emergency response guidance.

## Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will run on `http://localhost:3000` by default.

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

#### DELETE /api/users/:id

Delete user.

#### POST /api/users/:id/health-conditions

Add health condition.

#### DELETE /api/users/:id/health-conditions/:condition

Remove health condition.

#### POST /api/users/:id/allergies

Add allergy.

#### DELETE /api/users/:id/allergies/:allergy

Remove allergy.

### Emergency

#### POST /api/emergency/analyze

Get AI analysis for emergency situation (protected).

## Database

The application uses MongoDB with Mongoose ODM. Make sure MongoDB is running locally or update the connection string in `src/config/database.ts`.

## Features

- User authentication with JWT
- User profile management
- Health conditions and allergies tracking
- AI-powered emergency analysis using Google Gemini
- RESTful API design
- TypeScript support
- CORS enabled for frontend integration

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
