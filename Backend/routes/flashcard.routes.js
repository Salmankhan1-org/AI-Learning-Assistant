const express = require("express");
const { generateFlashcards } = require("../controllers/flashcard.controllers/ai.generate.flashcard");

const { isAuthenticated } = require("../middlewares/authToken");
const { deleteMySingleFlashcard } = require("../controllers/flashcard.controllers/delete.my.flashcard.single");
const { getMySingleFlashcard } = require("../controllers/flashcard.controllers/get.my.single.flashcard");
const { toggleStartCard } = require("../controllers/flashcard.controllers/flashcard.toggle.star");
const { markFlashcardAsReviewed } = require("../controllers/flashcard.controllers/flashcard.mark.review");
const { getMyFlashcards } = require("../controllers/flashcard.controllers/get.my.document.flashcard.sets");
const { getMyAllFlashcards } = require("../controllers/flashcard.controllers/get.my.all.flashcards");
const router = express.Router();
router.get('/flashcards/:flashcardId', isAuthenticated, getMySingleFlashcard);
// Toggle the card Star
router.patch('/flashcards/:flashcardId/cards/:cardId/star', isAuthenticated,  toggleStartCard);
// Mark card as reviewed
router.patch('/flashcards/:flashcardId/cards/:cardId/review', isAuthenticated,  markFlashcardAsReviewed);

router.post('/flashcard/:documentId/new',isAuthenticated , generateFlashcards);
// Fetch all flashcard of a particular document
router.get('/flashcards/:documentId/get', isAuthenticated ,getMyFlashcards);
// Fetch all flashcards created by a user from all documents
router.get('/flashcards/get/all', isAuthenticated, getMyAllFlashcards);
// Delete a Flashcard
router.delete('/flashcards/:flashcardId/delete', isAuthenticated, deleteMySingleFlashcard);

module.exports = router;