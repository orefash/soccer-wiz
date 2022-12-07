
const { when } = require('jest-when')
require("dotenv").config();

const { connect, clearDatabase, closeDatabase } = require('../db')


const { GatewayTransaction, gatewayTransactionService } = require('../../gatewayTransaction')
// const GatewayTransactionService = require('../../gatewayTransaction/gatewayTransaction.service');

// const gatewayTransactionService = GatewayTransactionService(GatewayTransaction)


const { WalletTransaction, walletTransactionService } = require('../../walletTransaction')
// const WalletTransactionService = require('./walletTransaction.service')

// const walletTransactionService = WalletTransactionService(WalletTransaction);

const { User, userService } = require('../../user')


const { flutterwaveService } = require('../../flutterwave')


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())



describe('Flutterwave Service (Must be online to test)', () => {

    describe('getFlutterwaveLink - live ', () => {
        it('should return a flutterwave payment link if user exists, amount >= 300, ', async () => {

            const newUser = {
                email: "orefash@gmail.com",
                password: "password",
                source: "local"
            }

            const savedUser = await userService.addLocalUser(newUser);

            const flutterwaveData = {
                userId: savedUser._id,
                currency: "NGN",
                amount: 600
            }


            const flwLinkData = await flutterwaveService.getFlutterwaveLink(flutterwaveData);

            const gatewayTransaction = await gatewayTransactionService.getGatewayTransactionByRef(flwLinkData.tx_ref)

            // console.log(flwLinkData)

            expect(flwLinkData.success).toBe(true)
            expect(flwLinkData.data.data.link).toBeTruthy();
            expect(gatewayTransaction).toBeTruthy();
        })

    })


    describe('getFlutterwaveLink', () => {
        it('should throw error if user does not exists, ', async () => {

            const flutterwaveData = {
                userId: 'savedUser._id',
                currency: "NGN",
                amount: 600
            }

            await expect(flutterwaveService.getFlutterwaveLink(flutterwaveData)).rejects.toThrow()
        })

    })

    describe('getFlutterwaveLink', () => {
        it('should throw error if amount <  300 ', async () => {

            const newUser = {
                email: "orefash@gmail.com",
                password: "password",
                source: "local"
            }

            const savedUser = await userService.addLocalUser(newUser);

            const flutterwaveData = {
                userId: savedUser._id,
                currency: "NGN",
                amount: 200
            }


            await expect(flutterwaveService.getFlutterwaveLink(flutterwaveData)).rejects.toThrow()

        })

    })


    describe('fundWalletWithFlutterwave', () => {
        it('should increase user wallet value with credits if FLw payment is successful', async () => {

            let user = await userService.addLocalUser({
                email: "orefash@gmail.com",
                password: "password",
                source: "local"
            })

            let txRef = "12345"
            
            let initGtran = await gatewayTransactionService.saveGatewayTransaction({
                userId: user._id,
                transactionId: txRef,
                name: 'orefash',
                email: "orefash@mail.com",
                amount: 300,
                currency: "NGN",
                paymentStatus: "pending",
                paymentGateway: "flutterwave"
            })

            const data = {
                status: "successful",
                tx_ref: txRef,
                source: "local"
            }

            const savedUser = await userService.addLocalUser(newUser);
            console.log("user: ", savedUser)

            const flutterwaveData = {
                userId: savedUser._id,
                currency: "NGN",
                amount: 200
            }


            await expect(flutterwaveService.getFlutterwaveLink(flutterwaveData)).rejects.toThrow()

        })

    })

})