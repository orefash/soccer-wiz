let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const monthlyScoreSchema = new Schema({
    userId: {type: mongoose.Types.ObjectId, ref: "user"},
    username: String,
    category: { type: String, index: true},
    score: Number
},
{ timestamps: true });

var monthlyScoreModel = mongoose.model("monthlyScore", monthlyScoreSchema, "monthlyScore");

module.exports = monthlyScoreModel;