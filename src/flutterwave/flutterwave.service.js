// const got = require('got');
const axios = require('axios');

const Flutterwave = require('flutterwave-node-v3');

const { generateId } = require("../utils/transactionIdGenerator");

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY_TEST, process.env.FLW_SECRET_KEY_TEST);


const getFlutterwaveLink = (userService, gatewayTransactionService) => async ({ currency, amount, userId }) => {

    let user = await userService.getUserById(userId);

    // console.log(`User: ${user} - userid: ${userId}`)

    if (!user)
        throw new Error("User does not exist");

    if (amount < 300)
        throw new Error("Amount below minimum amount");

    const transactionRef = generateId();

    const reqBody = {
        tx_ref: transactionRef,
        amount: amount,
        currency: currency,
        redirect_url: "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
        meta: {
            consumer_id: userId,
        },
        customer: {
            email: user.email,
            phonenumber: user.phone,
            name: user.username
        },
        customizations: {
            title: "Soccerwiz",
            // logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
        }
    }

    const flwUrl = "https://api.flutterwave.com/v3/payments"

    try {

        const response = await axios.post(flwUrl, reqBody, {
            headers: {
                'Authorization': `Bearer ${process.env.FLW_SECRET_KEY_TEST}`
            }
        })

        // console.log('FLw call link: ', response.data)


        if (response.data && response.data.status === 'success' && response.data.data.link) {
            await gatewayTransactionService.saveGatewayTransaction({ userId, transactionId: transactionRef, name: user.username, email: user.email, amount, currency, paymentStatus: "pending", paymentGateway: "flutterwave" });
            return { success: true, tx_ref: transactionRef, data: response.data };
        } else {
            return { success: false, message: 'Error getting Flw link' };
        }

    } catch (err) {
        console.log('flutterwave link error: ', err.code);
        console.log('flutterwave link error: ', err.message);

        return {
            success: false,
            err_code: err.code,
            message: err.message

        }
    }

}


const fundWalletWithFlutterwave = (walletTransactionService, userService, gatewayTransactionService) => async ({ status, tx_ref, transaction_id }) => {


    if (status === 'successful') {

        const transactionDetails = await gatewayTransactionService.getGatewayTransactionByRef(tx_ref);
        if (!transactionDetails)
            throw new Error('Invalid Transaction Reference')

        const response = await flw.Transaction.verify({ id: transaction_id });
        if (
            response.data.status === "successful"
            && response.data.amount === transactionDetails.amount
            && response.data.currency === transactionDetails.currency) {
            // Success! Confirm the customer's payment

            //convert amount to credits
            let noOfCredits = transactionDetails.amount / 300 * 10

            userService.updateWalletBalance({ id: transactionDetails.userId, credits: noOfCredits })

            await walletTransactionService.saveWalletTransaction({ credits: noOfCredits, userId: transactionDetails.userId, isInflow: true, amount: transactionDetails.amount, currency: transactionDetails.currency, status: "successful", paymentMethod: "flutterwave" });

            await gatewayTransactionService.updateGatewayTransactions({ id: transactionDetails._id, paymentStatus: "successful" })

            return {
                success: true,
                amount: transactionDetails.amount
            }

        }
        else {
            // Inform the customer their payment was unsuccessful
            await gatewayTransactionService.updateGatewayTransactions({ id: transactionDetails._id, paymentStatus: "failed" })

        }
    }

    return {
        success: false,
        message: "payment unsuccessful"
    }

}



module.exports = (walletTransactionService, userService, gatewayTransactionService, got) => {
    return {
        fundWalletWithFlutterwave: fundWalletWithFlutterwave(walletTransactionService, userService, gatewayTransactionService),
        getFlutterwaveLink: getFlutterwaveLink(userService, gatewayTransactionService, got)
    }
}