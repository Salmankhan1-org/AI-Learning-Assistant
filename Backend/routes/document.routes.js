const express = require("express");
const { isAuthenticated, isAdmin } = require("../middlewares/authToken");
const { uploadDocument } = require("../controllers/document.controllers/upload.new.document");
const { getAllDocuments } = require("../controllers/document.controllers/documents.get.all");
const { getSingleDocument } = require("../controllers/document.controllers/document.get.single");
const { allowedFileTypes } = require("../middlewares/allowedFileTypes");
const { handleUpload } = require("../middlewares/handleUpload");
const { generateSummaryOfDocument } = require("../controllers/document.controllers/document.ai.summarize");
const { explainConceptUsingAI } = require("../controllers/document.controllers/document.ai.concept.explain");
const { aiChat } = require("../controllers/ai.chats.controllers/ai.chat");
const { getDocumentAiChats } = require("../controllers/ai.chats.controllers/get.document.ai.chats");
const { getAllDocumentsDetailsByAdmin } = require("../controllers/document.controllers/document.admin.get.all");
const { deleteDocumentById } = require("../controllers/document.controllers/document.delete.single");
const router = express.Router();

// Get All Documents of a User
router.get('/documents/all',isAuthenticated, getAllDocuments);
// Fetch Single Document By Id
router.get("/documents/:documentId", isAuthenticated, getSingleDocument);
// Upload Document (pdfs, Docs and txt)
router.post('/document/new', isAuthenticated ,handleUpload, uploadDocument);
// generate summary of Document
router.get("/documents/:documentId/summary",isAuthenticated,  generateSummaryOfDocument);
// Ai Chat
router.post('/documents/:documentId/chat/new', isAuthenticated, aiChat);
// Get Ai Chats
router.get('/documents/:documentId/chats/get', isAuthenticated, getDocumentAiChats);
// Explain a Concept using AI
router.post("/documents/:documentId/explain/concept", isAuthenticated, explainConceptUsingAI);
// Get Document Analysis for Admin

router.get("/documents/admin/get/all",isAuthenticated, isAdmin,  getAllDocumentsDetailsByAdmin);

router.delete('/documents/:documentId/admin/delete', isAuthenticated, isAdmin, deleteDocumentById);



module.exports = router;