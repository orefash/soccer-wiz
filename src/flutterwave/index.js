

const { userService } = require('../user')
const { gatewayTransactionService } = require('../gatewayTransaction')
const { walletTransactionService } = require('../walletTransaction')

const FlutterwaveService = require('./flutterwave.service')
const FlwController = require('./flutterwave.controller')

const flutterwaveService =  FlutterwaveService(walletTransactionService, userService, gatewayTransactionService)



module.exports = {
    flutterwaveService: flutterwaveService,
    FlwController: FlwController.flwRoutes(flutterwaveService)
}