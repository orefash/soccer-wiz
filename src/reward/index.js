
const Reward = require('./reward.model');
const RewardService = require('./reward.service');
const RewardController = require('./reward.controller');

const User = require('../user/user.model');
const UserService = require('../user/user.service');

const rewardService = RewardService(Reward,  UserService(User));

module.exports = {
    rewardService: rewardService,
    Reward: Reward,
    RewardController: RewardController.rewardRoutes(rewardService)
}