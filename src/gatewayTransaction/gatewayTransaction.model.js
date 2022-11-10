let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const gatewayTransactionSchema = Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        transactionId: {
            type: String,
            trim: true,
        },
        name: {
            type: String,
            // required: [true, "name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "email is required"],
            trim: true,
        },
        phone: {
            type: String,
        },
        amount: {
            type: Number,
            required: [true, "amount is required"],
        },
        currency: {
            type: String,
            required: [true, "currency is required"],
            enum: ["NGN", "USD", "EUR", "GBP"],
        },
        paymentStatus: {
            type: String,
            enum: ["successful", "pending", "failed"],
            default: "pending",
        },
        paymentGateway: {
            type: String,
            required: [true, "payment gateway is required"],
            enum: ["flutterwave"], // Payment gateway might differs as the application grows
        },
    },
    {
        timestamps: true,
    }
);

var gatewayTransactionModel = mongoose.model("gatewayTransactions", gatewayTransactionSchema, "gatewayTransactions");

module.exports = gatewayTransactionModel;