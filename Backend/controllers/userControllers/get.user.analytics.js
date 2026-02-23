const Document = require("../../models/document.schema");
const FlashCard = require("../../models/flashcard.schema");
const Quiz = require("../../models/quiz.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const mongoose = require("mongoose");

exports.getUserAnalytics = catchAsyncError(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  /* Quick Analysis Data counts */

  const [documents, flashcards, quizes] = await Promise.all([
    Document.countDocuments({ userId, isDeleted: false }),
    FlashCard.countDocuments({ userId, isDeleted: false }),
    Quiz.countDocuments({ userId, isDeleted: false }),
  ]);

  /* Average quiz score */

  const avgScoreResult = await Quiz.aggregate([
    {
      $match: {
        userId,
        isDeleted: false,
        completedAt: { $ne: null },
      },
    },
    {
      $addFields: {
        percentage: {
          $multiply: [{ $divide: ["$score", "$totalQuestions"] }, 100],
        },
      },
    },
    {
      $group: {
        _id: null,
        averageScore: { $avg: "$percentage" },
      },
    },
  ]);

  const averageQuizScore =
    avgScoreResult.length > 0
      ? Number(avgScoreResult[0].averageScore.toFixed(2))
      : 0;

  /* Performance Over time */

  const performanceRaw = await Quiz.aggregate([
    {
      $match: {
        userId,
        isDeleted: false,
        completedAt: { $ne: null },
      },
    },
    {
      $group: {
        _id: { $month: "$completedAt" },
        avgScore: {
          $avg: {
            $multiply: [{ $divide: ["$score", "$totalQuestions"] }, 100],
          },
        },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const performanceOverTime = performanceRaw.map(item => ({
    month: monthNames[item._id - 1],
    score: Number(item.avgScore.toFixed(0)),
  }));

  /* Score per Document */

  const scorePerDocument = await Quiz.aggregate([
    {
      $match: {
        userId,
        isDeleted: false,
        completedAt: { $ne: null },
      },
    },
    {
      $lookup: {
        from: "documents",
        localField: "documentId",
        foreignField: "_id",
        as: "document",
      },
    },
    { $unwind: "$document" },
    {
      $group: {
        _id: "$document.title",
        avgScore: {
          $avg: {
            $multiply: [{ $divide: ["$score", "$totalQuestions"] }, 100],
          },
        },
      },
    },
  ]);

  const formattedScorePerDocument = scorePerDocument.map(item => ({
    name: item._id,
    score: Number(item.avgScore.toFixed(0)),
  }));

  
  const getWeekStart = () => {
    const now = new Date();
    const first = now.getDate() - now.getDay() + 1;
    return new Date(now.setDate(first));
  };

  const weekStart = getWeekStart();

  const [docActivity, flashActivity, quizActivity] = await Promise.all([
    Document.aggregate([
      { $match: { userId, createdAt: { $gte: weekStart } } },
      { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
    ]),
    FlashCard.aggregate([
      { $match: { userId, createdAt: { $gte: weekStart } } },
      { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
    ]),
    Quiz.aggregate([
      { $match: { userId, createdAt: { $gte: weekStart } } },
      { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
    ]),
  ]);

  const daysMap = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const weeklyActivity = daysMap.map((day, index) => ({
    day,
    docs: docActivity.find(d => d._id === index + 1)?.count || 0,
    flashcards: flashActivity.find(d => d._id === index + 1)?.count || 0,
    quizzes: quizActivity.find(d => d._id === index + 1)?.count || 0,
  }));


  const weakTopicsRaw = await Quiz.aggregate([
    { $match: { userId, isDeleted: false } },
    { $unwind: "$userAnswers" },
    { $match: { "userAnswers.isCorrect": false } },
    {
      $lookup: {
        from: "documents",
        localField: "documentId",
        foreignField: "_id",
        as: "document",
      },
    },
    { $unwind: "$document" },
    {
      $group: {
        _id: "$document.title",
        wrongCount: { $sum: 1 },
      },
    },
    { $sort: { wrongCount: -1 } },
    { $limit: 3 },
  ]);

  const weakTopics = weakTopicsRaw.map(item => ({
    name: item._id,
    value: item.wrongCount,
  }));

 
  res.status(200).json({
    success: true,
    data: {
      documents,
      flashcards,
      quizes,
      averageQuizScore,
      performanceOverTime,
      scorePerDocument: formattedScorePerDocument,
      weeklyActivity,
      weakTopics,
    },
  });
});
