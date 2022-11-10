let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const answerSchema = new Schema({
    optionNumber: Number,
    answerText: String,
    isCorrect: Boolean
}, { _id : false });


const questionSchema = new Schema({
    question: {
        type: String,
        required: 'Please enter your question',
        trim: true,
		minlength: 1,
    },
    category: { type: String, index: true,
        trim: true, },
    active: {
        type: Boolean,
        default: true
    }, 
    points: {
        type: Number,
        default: 1
    },
    answers: [answerSchema]
},
{ timestamps: true });

var questionModel = mongoose.model("question", questionSchema, "question");

module.exports = questionModel;