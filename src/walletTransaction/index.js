

const WalletTransaction = require('./walletTransaction.model')
const WalletTransactionService = require('./walletTransaction.service')
const WalletController = require('./walletTransaction.controller')

const walletTransactionService = WalletTransactionService(WalletTransaction);


const { userService } = require('../user')

module.exports = {
    walletTransactionService: walletTransactionService,
    WalletTransaction: WalletTransaction,
    WalletController: WalletController.walletRoutes(walletTransactionService, userService)
}