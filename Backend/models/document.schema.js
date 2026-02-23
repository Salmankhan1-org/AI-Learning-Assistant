const mongoose = require("mongoose");
const { Schema } = mongoose;

// Chunk Subschema 
const chunkSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    pageNumber: {
      type: Number,
      required: true
    },
    chunkIndex: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

// Main Document Schema
const documentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    file: {
      originalName: {
        type: String,
        required: true
      },
      url: {
        type: String, // Cloudinary 
      },
      size: {
        type: String, // bytes
        required: true
      },
      mimeType: {
        type: String,
        required: true
      }
    },

    extractedText: {
      type: String,
      default: "" // populated after processing
    },

    chunks: {
      type: [chunkSchema],
      default: []
    },

    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
      index: true
    },

    processingError: {
      type: String // if failed
    },

    lastAccessedAt: {
      type: Date
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

documentSchema.index({ userId : 1, isDeleted : 1 });
documentSchema.index({ userId: 1, createdAt: -1 });
documentSchema.index({ status: 1, createdAt: -1 });

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
