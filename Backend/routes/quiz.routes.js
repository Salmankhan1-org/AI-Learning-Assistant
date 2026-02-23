const express = require("express");
const { generateQuiz } = require("../controllers/quiz.controllers/ai.generate.quiz");
const { isAuthenticated } = require("../middlewares/authToken");
const { getMyQuizzesOfDocument } = require("../controllers/quiz.controllers/get.my.document.quizzes");
const { deleteQuizUsingId } = require("../controllers/quiz.controllers/delete.quiz.single");
const { getQuizById } = require("../controllers/quiz.controllers/get.quiz.single");
const { submitQuiz } = require("../controllers/quiz.controllers/quiz.submit");
const router = express.Router();

// delete quiz by quiz Id
router.delete('/:quizId/delete', isAuthenticated, deleteQuizUsingId);
//fetch single quiz by Id
router.get('/:quizId/get', isAuthenticated, getQuizById);
//Submit Quiz
router.post('/:quizId/submit', isAuthenticated, submitQuiz);
// generate quiz
router.post('/:documentId/new',isAuthenticated, generateQuiz);
// Fetch all quizzes of a particular document
router.get('/:documentId/get/all', isAuthenticated, getMyQuizzesOfDocument);

module.exports = router;