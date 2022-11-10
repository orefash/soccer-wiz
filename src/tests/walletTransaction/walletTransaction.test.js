
const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { WalletTransaction } = require('../../walletTransaction')
const WalletTransactionService = require('../../walletTransaction/walletTransaction.service');



const walletTransactionService = WalletTransactionService(WalletTransaction) 


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())



describe('Wallet Transaction Service', () => {

    describe('saveWalletTransaction', () => {
        it('should save wallet Transactions', async () => {

            const newTransaction = {
                credits: 1,
                userId: '56cb91bdc3464f14678934ca',
                isInflow: true,
                amount: 300,
                currency: "NGN",
                status: "successful",
                paymentMethod: "flutterwave"
            }

            let transaction = await walletTransactionService.saveWalletTransaction(newTransaction);

            expect(transaction.userId).toBe(newTransaction.userId)
            expect(transaction.amount).toBe(newTransaction.amount)
        })

    })


    describe('getWalletTransactions', () => {
        it('should get all wallet Transactions', async () => {

            const newTransaction = {
                credits: 1,
                userId: '56cb91bdc3464f24678934ca',
                isInflow: true,
                amount: 300,
                currency: "NGN",
                status: "successful",
                paymentMethod: "flutterwave"
            }

            const newTransaction2 = {
                credits: 1,
                userId: '56cb91bdc3464f14678934ca',
                isInflow: true,
                amount: 300,
                currency: "NGN",
                status: "successful",
                paymentMethod: "flutterwave"
            }

            await walletTransactionService.saveWalletTransaction(newTransaction);
            await walletTransactionService.saveWalletTransaction(newTransaction2);

            let transactions = await walletTransactionService.getWalletTransactions();

            expect(transactions.length).toBe(2)
        })

    })


    describe('getWalletTransactionsById', () => {
        it('should get all wallet Transactions for a User', async () => {

            const newTransaction = {
                credits: 1,
                userId: '56cb91bdc3464f24678934ca',
                isInflow: true,
                amount: 300,
                currency: "NGN",
                status: "successful",
                paymentMethod: "flutterwave"
            }

            const newTransaction2 = {
                credits: 1,
                userId: '56cb91bdc3464f14678934ca',
                isInflow: true,
                amount: 300,
                currency: "NGN",
                status: "successful",
                paymentMethod: "flutterwave"
            }

            const newTransaction3 = {
                credits: 1,
                userId: '56cb91bdc3464f24678934ca',
                isInflow: true,
                amount: 300,
                currency: "NGN",
                status: "successful",
                paymentMethod: "flutterwave"
            }

            await walletTransactionService.saveWalletTransaction(newTransaction);
            await walletTransactionService.saveWalletTransaction(newTransaction2);
            await walletTransactionService.saveWalletTransaction(newTransaction3);

            let transactions = await walletTransactionService.getWalletTransactionsByUser('56cb91bdc3464f24678934ca');

            expect(transactions.length).toBe(2)
        })

    })


})