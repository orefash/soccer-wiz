
const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { GatewayTransaction } = require('../../gatewayTransaction')
const GatewayTransactionService = require('../../gatewayTransaction/gatewayTransaction.service');

const gatewayTransactionService = GatewayTransactionService(GatewayTransaction) 


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())



describe('Gateway Transaction Service', () => {

    describe('saveGatewayTransaction', () => {
        it('should save gateway Transactions', async () => {

            const newTransaction = {
                transactionId: 12345,
                name: 'orefash',
                email: "orefash@mail.com",
                amount: 300,
                currency: "NGN",
                paymentStatus: "successful",
                paymentGateway: "flutterwave"
            }

            let transaction = await gatewayTransactionService.saveGatewayTransaction(newTransaction);

            expect(transaction.transactionId).toBe(newTransaction.transactionId)
            expect(transaction.amount).toBe(newTransaction.amount)
        })

    })


    describe('getGatewayTransactions', () => {
        it('should get all gateway Transactions', async () => {

            const newTransaction = {
                transactionId: 12345,
                name: 'orefash',
                email: "orefash@mail.com",
                amount: 300,
                currency: "NGN",
                paymentStatus: "successful",
                paymentGateway: "flutterwave"
            }

            const newTransaction1 = {
                transactionId: 12342,
                name: 'orefash',
                email: "orefash@mail.com",
                amount: 600,
                currency: "NGN",
                paymentStatus: "successful",
                paymentGateway: "flutterwave"
            }

            let transaction = await gatewayTransactionService.saveGatewayTransaction(newTransaction);
            await gatewayTransactionService.saveGatewayTransaction(newTransaction1);

            let transactions = await gatewayTransactionService.getGatewayTransactions();

            expect(transactions.length).toBe(2)
        })

    })


})