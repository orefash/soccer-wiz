

const { rewards, getReward } = require('../../reward/rewards')

describe('Rewards',  () => {
    it('should return correct reward based on score', async () => {

        expect(getReward(14)).toEqual(null)
        expect(getReward(16)).toEqual(rewards.t1)
        expect(getReward(17)).toEqual(rewards.t1)
        expect(getReward(19)).toEqual(rewards.t2)
        expect(getReward(21)).toEqual(rewards.t2)
        expect(getReward(22.5)).toEqual(rewards.t3)

    })

})