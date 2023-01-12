"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const rewardSchema = new Schema({
    minRewardPoints: {
        type: Number,
        default: 0
    },
    isCorrect: Boolean
}, { _id : false });

const categorySchema = new Schema({
    category: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { _id : true });


const gameSettingSchema = new Schema({
    // categories: [categorySchema],
    creditBuyList: [{type: Number}],
    currentGameWeek: {
        type: Number, default: 1
    },
    costPerCredit: {type: Number, default: 0, required: true},
    creditsPerGame: {type: Number, default: 10, required: true},
    minPointsForReward: {
        type: Number, required: true
    },
    questionTimeLimit: {type: Number, default: 12, required: true},
    questionPerQuiz: {type: Number, default: 15, required: true},
    
},
{
    timestamps: true,
    // capped: { size: 1024, max: 1, autoIndexId: true }
});

var gameSettingModel = mongoose.model("gameSetting", gameSettingSchema, "gameSetting");

module.exports = gameSettingModel;