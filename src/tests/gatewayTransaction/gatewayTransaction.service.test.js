
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
                userId: '56cb91bdc3464f14678934ca',
                transactionId: "12345",
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
                transactionId: "12345",
                name: 'orefash',
                email: "orefash@mail.com",
                amount: 300,
                currency: "NGN",
                paymentStatus: "successful",
                paymentGateway: "flutterwave"
            }

            const newTransaction1 = {
                transactionId: "12342",
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


    describe('getGatewayTransactionByRef', () => {
        it('should get gateway Transaction by Reference if it exists', async () => {

            const newTransaction = {
                transactionId: "asd12345",
                name: 'orefash',
                email: "orefash@mail.com",
                amount: 300,
                currency: "NGN",
                paymentStatus: "successful",
                paymentGateway: "flutterwave"
            }

            const newTransaction1 = {
                transactionId: "aed12345",
                name: 'orefash',
                email: "orefash@mail.com",
                amount: 600,
                currency: "NGN",
                paymentStatus: "successful",
                paymentGateway: "flutterwave"
            }

            await gatewayTransactionService.saveGatewayTransaction(newTransaction);
            await gatewayTransactionService.saveGatewayTransaction(newTransaction1);

            let transaction = await gatewayTransactionService.getGatewayTransactionByRef('aed12345');

            expect(transaction.transactionId).toBe(newTransaction1.transactionId)
            expect(transaction.amount).toBe(newTransaction1.amount)
        })

    })



    describe('getGatewayTransactionByRef', () => {
        it('should return null if Reference doesnt exist', async () => {

            const newTransaction = {
                transactionId: "asd12345",
                name: 'orefash',
                email: "orefash@mail.com",
                amount: 300,
                currency: "NGN",
                paymentStatus: "successful",
                paymentGateway: "flutterwave"
            }

            const newTransaction1 = {
                transactionId: "aed12345",
                name: 'orefash',
                email: "orefash@mail.com",
                amount: 600,
                currency: "NGN",
                paymentStatus: "successful",
                paymentGateway: "flutterwave"
            }

            await gatewayTransactionService.saveGatewayTransaction(newTransaction);
            await gatewayTransactionService.saveGatewayTransaction(newTransaction1);

            let transaction = await gatewayTransactionService.getGatewayTransactionByRef('ad12345');

            expect(transaction).toBe(null)
        })

    })


    describe('updateGatewayTransactions', () => {
        it('should update status of gateway transaction by ID', async () => {

            const newTransaction = {
                transactionId: "asd12345",
                name: 'orefash',
                email: "orefash@mail.com",
                amount: 300,
                currency: "NGN",
                paymentStatus: 'pending',
                paymentGateway: "flutterwave"
            }


            let savedTransaction = await gatewayTransactionService.saveGatewayTransaction(newTransaction);

            let transaction = await gatewayTransactionService.updateGatewayTransactions({ id: savedTransaction._id, paymentStatus: "successful" });

            expect(transaction.paymentStatus).toBe('successful')
            expect(transaction.amount).toBe(300)
        })

    })


})