let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const rewardSchema = Schema(
    {
        value: { type: Number, default: 0 },

        gameWeek: { type: Number, default: 0 },

        userId: {
            type: String,
            ref: "user",
            required: true,
        },

        claimed: { type: Boolean, default: false },
        issued: { type: Boolean, default: false },

        type: { 
            type: String, 
            enum: ["airtime", "cash"], 
        },

        currency: {
            type: String,
            default: "NGN",
            required: [true, "currency is required"],
            enum: ["NGN", "USD", "EUR", "GBP"],
        },

        issueDate: {
            type: Date,
            required: true,
        },

        claimDate: {
            type: Date,
        },

    }
);

var RewardModel = mongoose.model("rewards", rewardSchema, "rewards");

module.exports = RewardModel;