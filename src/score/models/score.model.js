let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const scoreSchema = new Schema({
    score: Number,
}, { _id : false, timestamps: true  });


const highScoreSchema = new Schema({
    userId: {type: mongoose.Types.ObjectId, ref: "user"},
    username: String,
    daily: scoreSchema,
    weekly: scoreSchema,
    monthly: scoreSchema
},
{ timestamps: true });

var highScoreModel = mongoose.model("highScore", highScoreSchema, "highScore");

module.exports = highScoreModel;