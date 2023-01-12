"use strict";
const GatewayTransaction = require('./gatewayTransaction.model')
const GatewayTransactionService = require('./gatewayTransaction.service')

const gatewayTransactionService = GatewayTransactionService(GatewayTransaction);

module.exports = {
    gatewayTransactionService: gatewayTransactionService,
    GatewayTransaction: GatewayTransaction,
}