const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { rewardService, Reward, RewardController } = require('../../reward')

const { WalletTransaction, walletTransactionService } = require('../../walletTransaction')

beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())


const reward1 = {
    gameWeek: 2, userId: '63776732713c51a3d29cd62e', value: 100, currency: 'NGN', type: 'airtime'
}

const reward2 = {
    gameWeek: 3, userId: '63776732713c51a3d19cd62e', value: 200, currency: 'NGN', type: 'cash'
}

const reward3 = {
    gameWeek: 4, userId: '63776732713c51a3d19cd62e', value: 300, currency: 'NGN', type: 'airtime'
}

describe('Reward Service', () => {

    describe('saveReward',  () => {
        it('should save reward details', async () => {

            const savedReward1 = await rewardService.saveReward(reward1)

            const savedReward2 = await rewardService.saveReward(reward2)

            const rewards = await rewardService.getRewards()

            expect(savedReward1.gameWeek).toBe(2)
            expect(savedReward2.gameWeek).toBe(3)

            expect(rewards.length).toBe(2)

        })

    })


    describe('getRewardsByUser',  () => {
        it('should get rewards by User', async () => {

            const savedReward1 = await rewardService.saveReward(reward1)
            const savedReward2 = await rewardService.saveReward(reward2)
            const savedReward3 = await rewardService.saveReward(reward3)

            let user = '63776732713c51a3d19cd62e'

            const rewards = await rewardService.getRewardsByUser(user)

            // console.log("rew; ", rewards)

            expect(savedReward1.gameWeek).toBe(2)
            expect(savedReward2.gameWeek).toBe(3)

            expect(rewards).not.toBeFalsy()
            expect(rewards.available.length).toBe(2)

        })

    })



    describe('claimReward',  () => {
        it('should allow User claim rewards', async () => {

            const savedReward1 = await rewardService.saveReward(reward1)
            const savedReward2 = await rewardService.saveReward(reward2)
            const savedReward3 = await rewardService.saveReward(reward3)

            let user = '63776732713c51a3d19cd62e'
            let rewardId1 = savedReward2._id;

            let data = { userId: user, rewardId: rewardId1 }

            const rewards = await rewardService.claimReward(data)

            // console.log("rew; ", rewards)

            // expect(savedReward1.gameWeek).toBe(2)
            // expect(savedReward2.gameWeek).toBe(3)
            // expect(savedReward2.gameWeek).toBe(3)

            expect(rewards.claimed).toBe(true)
            // expect(rewards.available.length).toBe(2)

        })

    })



    describe('issueReward',  () => {
        it('should allow Admin to issue User Claimed rewards', async () => {

            const savedReward1 = await rewardService.saveReward(reward1)
            const savedReward2 = await rewardService.saveReward(reward2)
            const savedReward3 = await rewardService.saveReward(reward3)

            let user = '63776732713c51a3d19cd62e'
            let rewardId1 = savedReward2._id;

            let data = { userId: user, rewardId: rewardId1 }

            const rewards = await rewardService.claimReward(data)

            const issuedReward = await rewardService.issueReward(rewardId1)
            // console.log("rew; ", rewards)

            // expect(savedReward1.gameWeek).toBe(2)
            // expect(savedReward2.gameWeek).toBe(3)
            // expect(savedReward2.gameWeek).toBe(3)

            expect(rewards.claimed).toBe(true)
            expect(issuedReward.issued).toBe(true)
            // expect(rewards.available.length).toBe(2)

        })

    })

})