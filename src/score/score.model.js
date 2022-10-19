let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const scoreSchema = new Schema({
    score: Number,
    lastUpdate: Date
}, { _id : false });


const highScoreSchema = new Schema({
    userID: {type: mongoose.Types.ObjectId, ref: "user"},
    username: String,
    daily: scoreSchema,
    weekly: scoreSchema,
    monthly: scoreSchema
});

var highScoreModel = mongoose.model("highScore", highScoreSchema, "highScore");

module.exports = highScoreModel;