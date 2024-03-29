let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const answerSchema = new Schema({
    optionNumber: Number,
    answerText: String,
    isCorrect: Boolean
}, { _id: false });


const questionSchema = new Schema({
    question: {
        type: String,
        required: 'Please enter your question',
        trim: true,
        minlength: 1,
    },
    category: {
        type: String,
        index: true,
        required: 'Please enter category',
        trim: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    points: {
        type: Number,
        default: 1
    },
    gameWeek: {
        index: true,
        type: Schema.Types.ObjectId, 
        ref: 'gameWeek',
        required: 'Please specify gameweek Id',
    },
    answers: {
        type: [answerSchema],
        // validate: v => Array.isArray(v) && v.length  == 4,
        validate: [(val) => val.length === 4, 'Must have 4 options']
    }
},
    { timestamps: true });

var questionModel = mongoose.model("question", questionSchema, "question");

module.exports = questionModel;