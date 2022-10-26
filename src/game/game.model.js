let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const attemptSchema = new Schema({
    timeTaken: Number,
    isCorrect: Boolean
}, { _id : false });


const gameSchema = new Schema({
    category: {
        type: String, index: true
    },
    player: {type: mongoose.Types.ObjectId, ref: "user"},
    username: String,
    answers: [attemptSchema],
    score: {type: Number, default: 0},
    createdAt: { type: Date, default: new Date() }
});

var gameModel = mongoose.model("game", gameSchema, "game");

module.exports = gameModel;