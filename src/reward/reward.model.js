let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const rewardSchema = Schema(
    {
        value: { type: Number, default: 0 },

        gameWeek: {
            type: Schema.Types.ObjectId,
            ref: 'gameWeek',
            required: 'Please specify gameweek Id',
            index: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        claimed: {
            type: Boolean, default: false,
            index: true,
        },
        issued: {
            type: Boolean, default: false,
            index: true
        },

        type: {
            type: String,
            enum: ["airtime", "cash"],
            required: true
        },

        tier: {
            type: Number,
            enum: [1, 2, 3],
            required: true
        },

        currency: {
            type: String,
            default: "NGN",
            required: [true, "currency is required"],
            enum: ["NGN", "USD", "EUR", "GBP"],
        },

        issueDate: {
            type: Date,
        },

        claimDate: {
            type: Date,
        },

    },
    { timestamps: true });

var RewardModel = mongoose.model("rewards", rewardSchema, "rewards");

module.exports = RewardModel;