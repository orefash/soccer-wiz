const express = require('express');
const router = express.Router();

const requireJwtAuth = require('../middleware/requireUserJwtAuth');

function walletRoutes(WalletTransactionService, UserService) {
    const router = express.Router();

    router.get('/', async (req, res) => {

        try {
            const walletTransactions = await WalletTransactionService.getWalletTransactions();
            res.status(200).json({
                success: true,
                transactions: walletTransactions
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });

    router.get('/user/:userId',requireJwtAuth, async (req, res) => {

        try {
            let userId = req.params.userId;

            let user = await UserService.getUserById(userId);

            if(!user) throw new Error('User does not Exist')

            const walletTransactions = await WalletTransactionService.getWalletTransactionsByUser(userId);
            res.status(200).json({
                success: true,
                transactions: walletTransactions,
                credits: user.wallet_balance,
                points: user.totalScore
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });

    router.post('/', async (req, res, next) => {

        try {
            const { credits, userId, isInflow, value, description, currency, status, type } = req.body;

            // if (!category) {
            //     throw Error("Incomplete Request details")
            // }

            let data = req.body;

            const walletData = await WalletTransactionService.saveWalletTransaction(data);

            res.status(200).json({
                success: true,
                transaction: walletData
            });


        } catch (err) {
            // return next(err);
            // console.log("reg erro: ", err)
            res.json({ success: false, message: err.message });
        }
    });


    return router;
}

module.exports.walletRoutes = walletRoutes