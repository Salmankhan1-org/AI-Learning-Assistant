require("dotenv").config();
require("./workers/documentProcessor");

const express = require("express");
const connectDB = require("./config/connectDB");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middlewares/error");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const requestId = require("./middlewares/requestId");
const requestLogger = require("./middlewares/requestLogger");

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true
}

/* Middlewares */
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
// app.use(limiter);
app.use(helmet());
// Logger Middlewares
app.use(requestId)
app.use(requestLogger)


/* Routes */
app.get("/", (req, res) => {
    res.send("Welcome to LMS Backend");
});

app.use("/api/v1/users", require("./routes/userRoutes"));
app.use('/api/v1', require("./routes/flashcard.routes"));
app.use('/api/v1', require('./routes/document.routes'));
app.use('/api/v1/quiz',require('./routes/quiz.routes'));


/* Error Handler */
app.use(errorHandler);

/* Server */
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
