let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const walletTransactionSchema = Schema(
    {
        credits: { type: Number, default: 0 },
        value: { type: Number, default: 0 },

        // Even though user can be implied from wallet, let us
        // double save it for security
        userId: {
            type: String,
            ref: "user",
            required: true,
        },

        isInflow: { type: Boolean },

        type: { 
            type: String, 
            enum: ["credits", "airtime", "cash"], 
        },

        currency: {
            type: String,
            default: "NGN",
            required: [true, "currency is required"],
            enum: ["NGN", "USD", "EUR", "GBP"],
        },

        description: {
            type: String,
            required: true,
            enum: ["Purchase of credits", "Withdrawal of rewards"],
        },

        status: {
            type: String,
            required: [true, "payment status is required"],
            enum: ["successful", "pending"],
        },
    },
    {
        timestamps: true,
    }
);

var walletTransactionModel = mongoose.model("walletTransactions", walletTransactionSchema, "walletTransactions");

module.exports = walletTransactionModel;