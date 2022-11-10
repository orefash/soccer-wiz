

const saveWalletTransaction = (WalletTransaction) => async ({ credits, userId, isInflow, amount, currency, status, paymentMethod }) => {

    const newTransaction = new WalletTransaction({ credits, userId, isInflow, amount, currency, status, paymentMethod })

    return newTransaction.save()
}



const getWalletTransactions = (WalletTransaction) => async () => {
    const transactions = await WalletTransaction.find();

    return transactions;
}


const getWalletTransactionsByUser = (WalletTransaction) => async (userId) => {

    const transactions = await WalletTransaction.find({ userId });

    return transactions;
}





module.exports = (WalletTransaction, userService, gatewayTransactionService) => {
    return {
        saveWalletTransaction: saveWalletTransaction(WalletTransaction),
        getWalletTransactions: getWalletTransactions(WalletTransaction),
        getWalletTransactionsByUser: getWalletTransactionsByUser(WalletTransaction)
    }
}