"use strict";
const axios = require('axios');

const Flutterwave = require('flutterwave-node-v3');

const { generateId } = require("../utils/transactionIdGenerator");



const getFlutterwaveLink = (userService, gatewayTransactionService) => async ({ currency, amount, userId }) => {

    let user = await userService.getUserById(userId);

    // console.log(`User: ${user} - userid: ${userId}`)

    if (!user)
        throw new Error("User does not exist");

    if (amount < 300)
        throw new Error("Amount below minimum amount");

    // if (amount%300!=0)
    //     throw new Error("Amount is not vali");
    const transactionRef = generateId();

    let server_url = null;
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction)
        server_url = process.env.SERVER_URL_PROD
    else
        server_url = process.env.SERVER_URL_DEV

    let redirect_url = server_url + '/api/payments/flw/validate';

    // console.log('Red URL: ', redirect_url)

    const reqBody = {
        tx_ref: transactionRef,
        amount: amount,
        currency: currency,
        redirect_url: redirect_url,
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

        let flwStatus = process.env.FLW_STATUS;
        let flwSecretKey = null;

        if (flwStatus === 'test') {
            flwSecretKey = process.env.FLW_SECRET_KEY_TEST
        } else {
            flwSecretKey = process.env.FLW_SECRET_KEY_LIVE
        }

        const response = await axios.post(flwUrl, reqBody, {
            headers: {
                'Authorization': `Bearer ${flwSecretKey}`
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


const fundWalletWithFlutterwave = (walletTransactionService, userService, gatewayTransactionService, conn) => async ({ status, tx_ref, transaction_id }) => {


    if (status === 'successful') {

        let flwStatus = process.env.FLW_STATUS;
        let flwSecretKey = null;
        let flwPublicKey = null;

        if (flwStatus === 'test') {
            flwSecretKey = process.env.FLW_SECRET_KEY_TEST
            flwPublicKey = process.env.FLW_PUBLIC_KEY_TEST
        } else {
            flwSecretKey = process.env.FLW_SECRET_KEY_LIVE
            flwPublicKey = process.env.FLW_PUBLIC_KEY_LIVE
        }

        const flw = new Flutterwave(flwPublicKey, flwSecretKey);

        const transactionDetails = await gatewayTransactionService.getGatewayTransactionByRef(tx_ref);

        // console.log('tran details: ', transactionDetails)
        if (!transactionDetails)
            throw new Error('Invalid Transaction Reference')

        const response = await flw.Transaction.verify({ id: transaction_id });
        if (
            response.data.status === "successful"
            && response.data.amount === transactionDetails.amount
            && response.data.currency === transactionDetails.currency
        ) {
            // Success! Confirm the customer's payment

            //convert amount to credits
            let noOfCredits = transactionDetails.amount / 300 * 10

            const session = await conn.startSession();

            try {

                session.startTransaction();

                userService.updateWalletBalance({ id: transactionDetails.userId, credits: noOfCredits }, session)

                await walletTransactionService.saveWalletTransaction({ credits: noOfCredits, userId: transactionDetails.userId, isInflow: true, value: transactionDetails.amount, currency: transactionDetails.currency, description: "Purchase of credits", status: "successful", paymentMethod: "flutterwave" }, session);

                await gatewayTransactionService.updateGatewayTransactions({ id: transactionDetails._id, paymentStatus: "successful" }, session)


                await session.commitTransaction();

                session.endSession();

                const redirect_url = process.env.CLIENT_URL_PROD+'/game'

                return {
                    success: true,
                    amount: transactionDetails.amount,
                    redirect: redirect_url
                }

            } catch (error) {
                console.log('Transaction error flw: ', error.message)
                await session.abortTransaction();
                throw new Error('Flw transaction: ', error.message)
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



module.exports = (walletTransactionService, userService, gatewayTransactionService, conn) => {
    return {
        fundWalletWithFlutterwave: fundWalletWithFlutterwave(walletTransactionService, userService, gatewayTransactionService, conn),
        getFlutterwaveLink: getFlutterwaveLink(userService, gatewayTransactionService)
    }
}