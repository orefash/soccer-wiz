let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const attemptSchema = new Schema({
    optionNumber: Number,
    answerText: String,
    isCorrect: Boolean
}, { _id : false });


const gameSchema = new Schema({
    question: {
        type: String,
        required: true,
        unique: true,
		minlength: 1,
    },
    category: String,
    player: {type: mongoose.Types.ObjectId, ref: "user"},
    active: {
        type: Boolean,
        default: true
    },
    answers: [attemptSchema],
    score: {type: Number, default: 0},
    createdAt: { type: Date, default: new Date() }
});

var gameModel = mongoose.model("game", gameSchema, "game");

module.exports = gameModel;