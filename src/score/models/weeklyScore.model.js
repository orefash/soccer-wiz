let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const weeklyScoreSchema = new Schema({
    userId: {type: mongoose.Types.ObjectId, ref: "user"},
    username: String,
    category: { type: String, index: true},
    matchweek: Number,
    score: Number,
},
{ timestamps: true });

var weeklyScoreModel = mongoose.model("weeklyScore", weeklyScoreSchema, "weeklyScore");

module.exports = weeklyScoreModel;