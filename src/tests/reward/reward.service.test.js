const { when } = require('jest-when');

const { connect, clearDatabase, closeDatabase } = require('../db');

const RewardService = require('../../reward/reward.service');
const Reward = require('../../reward/reward.model');

const { rewards } = require('../../reward/rewards');

const getUserById = jest.fn().mockReturnValue(true);

let userService = {
    getUserById: getUserById
}

const rewardService = RewardService(Reward, userService);

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());


describe('Reward Service', () => {

    let user1 = '63c8e9dea08a3244b63e9d05';
    let user2 = '63c8e9dea08a3244b63e9d06';
    let user3 = '63c8e9dea08a3244b63e9d07';

    let t1Reward = {
        userId: user1,
        score: 17,
        gameWeek: '63c8e9dea08a3244b63e9d05'
    }

    let t3Reward = {
        userId: user2,
        score: 22.5,
        gameWeek: '63c8e9dea08a3244b63e9d05'
    }

    // let t2Reward = {
    //     userId: user2,
    //     score: 22.5,
    //     gameWeek: '63c8e9dea08a3244b63e9d05'
    // }

    let noReward = {
        userId: user1,
        score: 13,
        gameWeek: '63c8e9dea08a3244b63e9d05'
    }

    beforeEach(async () => {

        const savedReward1 = await rewardService.saveReward(t1Reward);

        const savedReward2 = await rewardService.saveReward(t3Reward);

        const savedReward3 = await rewardService.saveReward(noReward);
    });

    describe('saveReward', () => {
        it('should save reward details if score is eligible and return null if ineligible', async () => {
            const fetchedRewards = await rewardService.getRewards()

            expect(fetchedRewards.length).toBe(2)
        })
    })


    describe('getRewardsByUser', () => {
        it('should get rewards by User', async () => {
            const rewards = await rewardService.getRewardsByUser(user1);

            expect(rewards).not.toBeFalsy();
            expect(rewards.available.length).toBe(1);
        });

        it('should return null when user is invalid', async () => {
            const rewards = await rewardService.getRewardsByUser(user3);

            console.log('in fetchby user: ', rewards);

            expect(rewards).not.toBeFalsy();
            expect(rewards.available.length).toBe(0);
            expect(rewards.claimed.length).toBe(0);
        });
    })



    describe('claimReward / Issue Reward', () => {

        let savedReward = undefined;

        beforeEach(async () => {

            savedReward = await rewardService.saveReward(t1Reward);

        });

        it('should allow User claim rewards', async () => {

            let rewardId1 = savedReward._id;

            let data = { userId: user1, rewardId: rewardId1 }

            const rewards = await rewardService.claimReward(data)

            expect(rewards.claimed).toBe(true);

        })

        it('should allow Admin to issue User Claimed rewards', async () => {

         
            let rewardId1 = savedReward._id;

            let data = { userId: user1, rewardId: rewardId1 }

            const rewards = await rewardService.claimReward(data)

            const issuedReward = await rewardService.issueReward(rewardId1)
           

            expect(rewards.claimed).toBe(true)
            expect(issuedReward.issued).toBe(true);

        })

    })



})