# AI Learning Assistant

## Overview
The AI Learning Assistant is a MERN stack project aimed at enhancing the learning experience through artificial intelligence. This application allows users to access various educational resources, interact with AI tutors, and track their progress in learning.

## Installation Instructions
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/Salmankhan1-org/AI-Learning-Assistant.git
   cd AI-Learning-Assistant
   ```  
2. **Install dependencies:**  
   ```bash
   npm install
   ```  
3. **Setup Environment Variables:**  
   Create a `.env` file at the root of the project and set the following values:  
   ```plaintext
   MONGO_URI=your_mongo_uri
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```  
4. **Run the application:**  
   ```bash
   npm start
   ```  
   The server will run on `http://localhost:5000`.

## Project Structure
```plaintext
AI-Learning-Assistant/
├── client/               # React frontend
│   ├── public/           # Public folder
│   └── src/              # Source folder for React components
├── server/               # Express backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Controllers for handling requests
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   └── server.js         # Entry point for the server
└── README.md             # Project documentation
```

## API Documentation
### Authentication
- **POST** `/api/auth/register`  
  Creates a new user account.
  - Request Body: `{ "username": "your_username", "password": "your_password" }`

- **POST** `/api/auth/login`  
  Logs in a user and returns a JWT token.
  - Request Body: `{ "username": "your_username", "password": "your_password" }`

### Resources
- **GET** `/api/resources`  
  Retrieves a list of educational resources.

- **GET** `/api/resources/:id`  
  Retrieves details about a specific resource.

## Other Essential Sections
### Features
- User authentication and authorization
- AI tutor interaction
- Progress tracking

### Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

### License
This project is licensed under the MIT License.