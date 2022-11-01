

const saveGatewayTransaction = (Gatewaytransaction) => async ({ transactionId, name, email, amount, currency, paymentStatus, paymentGateway }) => {

    const newTransaction = new Gatewaytransaction({ transactionId, name, email, amount, currency, paymentStatus, paymentGateway })

    return newTransaction.save()
}



const getGatewayTransactions = (Gatewaytransaction) => async () => {
    const transactions = await Gatewaytransaction.find();

    return transactions;
}


module.exports = (Gatewaytransaction) => {
    return {
        saveGatewayTransaction: saveGatewayTransaction(Gatewaytransaction),
        getGatewayTransactions: getGatewayTransactions(Gatewaytransaction)
    }
}