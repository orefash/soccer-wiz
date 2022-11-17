
const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { WalletTransaction } = require('../../walletTransaction')
const WalletTransactionService = require('../../walletTransaction/walletTransaction.service');



const walletTransactionService = WalletTransactionService(WalletTransaction) 


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())

const newTransaction = {
    credits: 1,
    userId: '56cb91bdc3464f24678934ca',
    isInflow: true,
    value: 300,
    currency: "NGN",
    status: "successful",
    description: 'Purchase of credits',
    type: "credits"
}

const newTransaction2 = {
    credits: 1,
    userId: '56cb91bdc3464f14678934ca',
    isInflow: true,
    value: 300,
    description: 'Purchase of credits',
    currency: "NGN",
    status: "successful",
    type: "credits"
}

const newTransaction3 = {
    credits: 1,
    userId: '56cb91bdc3464f24678934ca',
    isInflow: true,
    description: 'Purchase of credits',
    value: 300,
    currency: "NGN",
    status: "successful",
    type: "credits"
}

const newTransaction4 = {
    userId: '56cb91bdc3464f24678934ca',
    isInflow: true,
    description: 'Withdrawal of rewards',
    value: 200,
    currency: "NGN",
    status: "successful",
    type: "airtime"
}

const newTransaction5 = {
    userId: '56cb91bdc3464f24678934ca',
    isInflow: true,
    description: 'Withdrawal of rewards',
    value: 100,
    currency: "NGN",
    status: "successful",
    type: "cash"
}



describe('Wallet Transaction Service', () => {

    describe('saveWalletTransaction', () => {
        it('should save wallet Transactions', async () => {

            // const newTransaction = {
            //     credits: 1,
            //     userId: '56cb91bdc3464f14678934ca',
            //     isInflow: true,
            //     amount: 300,
            //     currency: "NGN",
            //     status: "successful",
            //     paymentMethod: "flutterwave"
            // }

            let transaction = await walletTransactionService.saveWalletTransaction(newTransaction);

            expect(transaction.userId).toBe(newTransaction.userId)
            expect(transaction.value).toBe(newTransaction.value)
        })

    })


    describe('getWalletTransactions', () => {
        it('should get all wallet Transactions', async () => {

            // const newTransaction = {
            //     credits: 1,
            //     userId: '56cb91bdc3464f24678934ca',
            //     isInflow: true,
            //     amount: 300,
            //     currency: "NGN",
            //     status: "successful",
            //     paymentMethod: "flutterwave"
            // }

            // const newTransaction2 = {
            //     credits: 1,
            //     userId: '56cb91bdc3464f14678934ca',
            //     isInflow: true,
            //     amount: 300,
            //     currency: "NGN",
            //     status: "successful",
            //     paymentMethod: "flutterwave"
            // }

            await walletTransactionService.saveWalletTransaction(newTransaction);
            await walletTransactionService.saveWalletTransaction(newTransaction2);
            await walletTransactionService.saveWalletTransaction(newTransaction4);

            let transactions = await walletTransactionService.getWalletTransactions();

            expect(transactions.length).toBe(3)
        })

    })


    describe('getWalletTransactionsById', () => {
        it('should get all wallet Transactions for a User', async () => {

            // s

            await walletTransactionService.saveWalletTransaction(newTransaction);
            await walletTransactionService.saveWalletTransaction(newTransaction2);
            await walletTransactionService.saveWalletTransaction(newTransaction3);
            await walletTransactionService.saveWalletTransaction(newTransaction4);
            await walletTransactionService.saveWalletTransaction(newTransaction5);

            let transactions = await walletTransactionService.getWalletTransactionsByUser('56cb91bdc3464f24678934ca');

            expect(transactions.length).toBe(4)
        })

    })


})