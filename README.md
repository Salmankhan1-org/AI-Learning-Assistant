## MentorMind Pvt Ltd
**AI-Powered Learning Assistant Platform**

MentorMind is a full-stack AI-driven learning platform that allows users to upload documents, automatically generate quizzes and flashcards, and track their learning progress over time.

The platform also provides powerful admin analytics to monitor user growth, document uploads, and overall engagement metrics.

## Features
**User Features**

```Upload learning documents (PDF, notes, etc.)
   Auto-generate:
   AI-powered Quizzes
   AI-powered Flashcards
   Track quiz performance over months
   View learning progress analytics
   Manage uploaded documents
   Search and organize content
   Secure authentication with role-based access
   Responsive dashboard (mobile + desktop)```

**Admin Features**

   ```Track number of users per month
   Track number of documents uploaded per month
   Visual analytics dashboards (Line / Doughnut charts)
   View all documents in tabular format
   Delete users or documents
   Search users by name & email
   System growth monitoring```

## Tech Stack
 **Frontend**
   ```React.js
   Redux Toolkit
   Tailwind CSS
   React Router
   Chart.js / Recharts
   Axios
   React Toastify```
 **Backend**
   ```Node.js
   Express.js
   MongoDB
   Mongoose
   JWT Authentication
   Role-Based Authorization```
 **AI Integration**
   ```context based search
   AI quiz & flashcard generation
   Document content processing```

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



### Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.


