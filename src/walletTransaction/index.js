

const WalletTransaction = require('./walletTransaction.model')
const WalletTransactionService = require('./walletTransaction.service')

const walletTransactionService = WalletTransactionService(WalletTransaction);

module.exports = {
    walletTransactionService: walletTransactionService,
    WalletTransaction: WalletTransaction,
}