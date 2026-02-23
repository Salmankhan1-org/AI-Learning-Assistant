const mongoose = require("mongoose");
const { Schema } = mongoose;


const flashcardItemSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium"
  },
  lastReviewed: {
    type: Date,
    default: null
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isStarred: {
    type: Boolean,
    default: false
  }
});

const flashcardSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    cards: {
      type: [flashcardItemSchema],
      required: true
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
  },
  { timestamps: true }
);

//indexes
flashcardSchema.index({ userId: 1, documentId: 1 });

const FlashCard = mongoose.model("FlashCard", flashcardSchema);
module.exports = FlashCard;
