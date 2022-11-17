
const Reward = require('./reward.model')
const RewardService = require('./reward.service')
const RewardController = require('./reward.controller')


const { walletTransactionService } = require('../walletTransaction')
const rewardService = RewardService(Reward, walletTransactionService);

const { userService } = require('../user')

module.exports = {
    rewardService: rewardService,
    Reward: Reward,
    RewardController: RewardController.rewardRoutes(rewardService, userService)
}