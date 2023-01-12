"use strict";

const saveGatewayTransaction = (GatewayTransaction) => async ({ userId, transactionId, name, email, amount, currency, paymentStatus, paymentGateway }) => {

    const newTransaction = new GatewayTransaction({ userId, transactionId, name, email, amount, currency, paymentStatus, paymentGateway })

    return newTransaction.save()
}


const updateGatewayTransactions = (GatewayTransaction) => async ({ id, paymentStatus }, session = null) => {

    let opts = {
        new: true
    }

    if(session) opts.session = session

    const updatedTransaction = await GatewayTransaction.findByIdAndUpdate(id, { paymentStatus }, opts);

    return updatedTransaction
}


const getGatewayTransactions = (GatewayTransaction) => async () => {
    const transactions = await GatewayTransaction.find();

    return transactions;
}


const getGatewayTransactionByRef = (GatewayTransaction) => async (tx_ref) => {
    const transaction = await GatewayTransaction.find({ transactionId: tx_ref });

    if(transaction && transaction.length === 1)
        return transaction[0];

    return null;
}

module.exports = (GatewayTransaction) => {
    return {
        saveGatewayTransaction: saveGatewayTransaction(GatewayTransaction),
        getGatewayTransactions: getGatewayTransactions(GatewayTransaction),
        getGatewayTransactionByRef: getGatewayTransactionByRef(GatewayTransaction),
        updateGatewayTransactions: updateGatewayTransactions(GatewayTransaction)
    }
}