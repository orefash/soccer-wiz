"use strict";
const express = require('express');

function flwRoutes(flwService) {
    const router = express.Router();

    router.get('/flw/validate', async (req, res, next) => {

        try {
            const { tx_ref, transaction_id, status } = req.query;

            if (!tx_ref && !status) {
                throw Error("Incomplete Request details")
            }

            let data = {
                tx_ref, status, transaction_id
            }

            const flwData = await flwService.fundWalletWithFlutterwave(data);

            res.status(200).json({
                flwData
            });


        } catch (err) {
            // return next(err);
            // console.log("reg erro: ", err)
            res.json({ success: false, message: err.message });
        }
    });



    router.get('/flw/pay-link/user/:userId', async (req, res, next) => {

        try {
            const { currency, amount } = req.query;
            let userId = req.params.userId;

            if (!currency || !amount || !userId) {
                throw Error("Incomplete Request details")
            }

            let data = {
                currency, amount, userId
            }

            const flwData = await flwService.getFlutterwaveLink(data);

            res.status(200).json({
                success: true,
                flwData: flwData
            });


        } catch (err) {
            // return next(err);
            // console.log("reg erro: ", err)
            res.json({ success: false, message: err.message });
        }
    });

    return router;
}



module.exports.flwRoutes = flwRoutes;