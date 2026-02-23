const mongoose = require("mongoose");
const { Schema } = mongoose;

// *Question Schema for Quiz* //
const quizQuestionSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
        validator: v => Array.isArray(v) && v.length === 4,
        message: "Each question must have exactly 4 options"
    }
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
        validator: function (value) {
        return this.options.includes(value);
        },
        message: "correctAnswer must be one of the options"
    }
    },
  explanation: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium"
  }
});

// * Answer Schema of Quiz for User Answers * //
const userAnswerSchema = new Schema({
  questionIndex: {
    type: Number,
    required: true
  },
  selectedAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  answeredAt: {
    type: Date,
    default: Date.now
  }
});


// * Schema For the Quiz * //
const quizSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      
    },
    questions: {
      type: [quizQuestionSchema],
      required: true
    },
    userAnswers: {
      type: [userAnswerSchema],
      default: []
    },
    score: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    completedAt: {
      type: Date
    },
    isDeleted:{
        type : Boolean,
        default : false
    }
  },
  { timestamps: true }
);

quizSchema.index({ userId: 1, documentId: 1 });

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
