

const saveWalletTransaction = (WalletTransaction) => async ({ credits, userId, isInflow, value, description, currency, status, type }, session = null) => {

    const newTransaction = new WalletTransaction({ credits, userId, isInflow, value, description, currency, status, type })

    let opts = {}
    if(session) opts.session = session
    return newTransaction.save(opts)
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