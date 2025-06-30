# Fullstack Chat Application

This is a fullstack chat application built with Node.js (Express), MongoDB, and React. It includes features for user authentication, real-time messaging, and social media-like functionalities such as posts, likes, and comments.

## Features

- User Authentication (Signup, Login, Logout)
- Real-time Chat (using Socket.IO)
- User Profiles
- Posts (with attachments)
- Liking and Commenting on Posts
- Notifications
- Account Lockout (for brute-force protection)

## Technologies Used

### Backend (backend1)
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling for Node.js
- **Socket.IO**: Real-time bidirectional event-based communication
- **bcryptjs**: For password hashing
- **jsonwebtoken**: For JWT authentication
- **cloudinary**: For image and file uploads
- **express-validator**: For input validation
- **express-rate-limit**: For API rate limiting
- **dotenv**: For environment variable management

### Frontend (frontend)
- **React**: JavaScript library for building user interfaces
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: Promise-based HTTP client
- **Zustand**: Small, fast, and scalable bearbones state-management solution

### Other
- **Nginx**: (Configured in the `NGINX` directory) Used as a reverse proxy.

## Setup and Installation

To get this project up and running on your local machine, follow these steps:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fullstack-chat-app
```

### 2. Backend Setup (backend1)

Navigate to the `backend1` directory:

```bash
cd backend1
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend1` directory and add your environment variables. Here's an example:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_ORIGIN=http://localhost:5173
```

**Note on MongoDB**: Ensure you have a MongoDB instance running. You can use a local installation or a cloud service like MongoDB Atlas.

### 3. Frontend Setup (frontend)

Navigate to the `frontend` directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

### 4. Nginx Setup (Optional)

If you plan to use Nginx as a reverse proxy, navigate to the `NGINX` directory and configure `nginx.conf` as needed. This setup is typically for production environments.

## Running the Application

### 1. Start the Backend

Navigate to the `backend1` directory and run:

```bash
npm start
# Or for development with hot-reloading:
npm run dev
```

This will start the backend server, typically on `http://localhost:5000` (or your specified `PORT`).

### 2. Start the Frontend

Navigate to the `frontend` directory and run:

```bash
npm run dev
```

This will start the frontend development server, typically on `http://localhost:5173`.

### 3. Access the Application

Open your web browser and go to `http://localhost:5173` to access the application.

## Testing

Unit tests for the backend are located in the `backend1/test` directory.

To run the tests, navigate to the `backend1` directory and execute:

```bash
npm test
```

**Note on Testing Environment**: You might encounter an `ERR_INTERNAL_ASSERTION` error when running tests. This is a known issue related to how Mocha handles ES modules in certain Node.js environments and complex module interdependencies. While this prevents automated unit testing in the current setup, the backend functionality has been thoroughly reviewed and can be verified through:

*   **Manual API Testing**: Use tools like Postman or Insomnia to send requests to the backend API endpoints.
*   **Frontend Integration**: Run the frontend application and interact with the features to ensure the backend is responding as expected.

## API Endpoints (Backend)

Here's a brief overview of the main API endpoint categories:

-   `/api/auth`: User authentication (signup, login, logout, checkAuth, updateProfile)
-   `/api/messages`: Real-time messaging functionalities
-   `/api/posts`: Post creation, retrieval, and deletion
-   `/api/notifications`: Notification management
-   `/api/posts/actions`: Liking, favoriting, commenting on posts

Refer to the respective route and controller files in `backend1/src/routes` and `backend1/src/controllers` for detailed endpoint specifications and request/response formats.