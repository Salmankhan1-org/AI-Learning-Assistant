const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ActivityLoggerSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    title : {
        type : String,
        required : true,
        trim : true
    },

    type : {
        type: String,
        required : true
    }
},{timestamps:true})


const ActivityLogger = mongoose.model('ActivityLogger', ActivityLoggerSchema);
module.exports = ActivityLogger;