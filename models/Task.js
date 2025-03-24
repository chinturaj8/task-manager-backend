

const mongoose = require("mongoose");
const User =require("./User");
const TaskSchema = new mongoose.Schema({
    title: { type: String, required:true },
    completed: { type: Boolean, default: false },
    status:{
        type:String,
        enum:["Not Started","In Progess","Pending","completed"],
        default: "Not started ",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User",required: true},
    attachments: [{ type:String}]
});

module.exports = mongoose.model("Task",TaskSchema);