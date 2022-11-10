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
    categories: [categorySchema],
    creditBuyList: [{type: Number}],
    currentGameWeek: {
        type: Number
    },
    costPerCredit: {type: Number, default: 0},
    creditsPerGame: {type: Number, default: 0},
    minPointsForReward: {
        type: Number
    },
},
{
    timestamps: true,
    // capped: { size: 1024, max: 1, autoIndexId: true }
});

var gameSettingModel = mongoose.model("gameSetting", gameSettingSchema, "gameSetting");

module.exports = gameSettingModel;