let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const dailyScoreSchema = new Schema({
    userId: {type: mongoose.Types.ObjectId, ref: "user"},
    username: String,
    category: { type: String, index: true},
    score: Number,
},
{ timestamps: true });

var dailyScoreModel = mongoose.model("dailyScore", dailyScoreSchema, "dailyScore");

module.exports = dailyScoreModel;