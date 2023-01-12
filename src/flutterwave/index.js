"use strict";

const { userService } = require('../user')
const { gatewayTransactionService } = require('../gatewayTransaction')
const { walletTransactionService } = require('../walletTransaction')

const FlutterwaveService = require('./flutterwave.service')
const FlwController = require('./flutterwave.controller')

const conn = require('../db')

const flutterwaveService =  FlutterwaveService(walletTransactionService, userService, gatewayTransactionService, conn)

module.exports = {
    FlutterwaveService: FlutterwaveService,
    flutterwaveService: flutterwaveService,
    FlwController: FlwController.flwRoutes(flutterwaveService)
}