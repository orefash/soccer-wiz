let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const walletTransactionSchema = Schema(
    {
        amount: { type: Number, default: 0 },
        credits: { type: Number, default: 0 },

        // Even though user can be implied from wallet, let us
        // double save it for security
        userId: {
            type: String,
            ref: "user",
            required: true,
        },

        isInflow: { type: Boolean },

        paymentMethod: { type: String, default: "flutterwave" },

        currency: {
            type: String,
            required: [true, "currency is required"],
            enum: ["NGN", "USD", "EUR", "GBP"],
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