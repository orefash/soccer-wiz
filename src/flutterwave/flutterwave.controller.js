const express = require('express');

function flwRoutes(flwService) {
    const router = express.Router();

    router.get('/flw/validate', async (req, res, next) => {

        try {
            const { tx_ref, transaction_id, status } = req.query;

            if (!tx_ref || !transaction_id || !status) {
                throw Error("Incomplete Request details")
            }

            let data = {
                tx_ref, status, transaction_id
            }

            // const flwData = await gameCategoryService.saveCategory(data);

            res.status(200).json({
                success: true,
                flwData: data
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