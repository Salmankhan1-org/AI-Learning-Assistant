const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Subschemas for Education
const class10Schema = new Schema({
  schoolName: { type: String, trim: true, required: true },
  percentage: { type: Number, min: 0, max: 100, required: true },
  startDate: { type: String, trim: true }, 
  endDate : {type:String, trim:true}
}, { _id: false });

const class12Schema = new Schema({
  schoolName: { type: String, trim: true, required: true },
  percentage: { type: Number, min: 0, max: 100, required: true },
  startDate: { type: String, trim: true }, 
  endDate : {type:String, trim:true}
}, { _id: false });

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // email regex
    index: true
  },
  password: {
    type: String,
    required: true,
    select: false,
    trim: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
    index: true
  },
  profileImage: {
    imageName : {type:String , trim:true},
    imageUrl : {type:String, trim:true}
  },
  bio: {
    type: String,
    maxlength: 500,
    trim: true
  },
  dateOfBirth: { type: Date },
  address: { type: String, trim: true },
  skills: [{ type: String, trim: true }],

  education: {
    class10: class10Schema,
    class12: class12Schema
  },
  isActive : {
    type: Boolean,
    default : true
  },
  isDeleted : {
    type : Boolean,
    defaul : false
  },

  // Password reset
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpiry: { type: Date },

  // Email verification
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String, select: false },
  emailVerificationExpiry: { type: Date }

}, { timestamps: true });

userSchema.index({ email: 1, role: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User;
