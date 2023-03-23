
const { getReward } = require('./rewards');

const saveReward = (Reward) => async ({score, userId, gameWeek}) => {

    let reward = getReward(score);

    if(!reward) return null;

    let rewardData = {
        ...reward,
        userId,
        gameWeek
    };
    
    const newReward = new Reward(rewardData);

    return newReward.save();
}

const claimReward = (Reward) => async ({rewardId, userId}) => {

    const rewards = await Reward.findOne({ _id: rewardId });

    if(rewards.claimed) throw new Error("Reward already claimed")

    if(rewards.userId != userId) throw new Error('Invalid User')

    const updatedReward = await Reward.findByIdAndUpdate(rewardId, { claimed: true, claimDate: new Date(), status: "Requested"  }, {
        new: true,
    });

    if(!updatedReward.claimed) throw new Error('Issue with Reward Claiming - DB Error')

    // console.log("Up Rewards; ", rewards)

    // if(updatedReward.claimed){
    //     const newTransaction = await walletTransactionService.saveWalletTransaction({ userId: userId, isInflow: false, value: updatedReward.value, description: "Withdrawal of rewards", status: "successful", type: updatedReward.type })
    // }

    return updatedReward
}


const issueReward = (Reward) => async (id) => {

    const rewards = await Reward.findOne({ _id: id })

    if(rewards.claimed !== true) throw new Error('Reward not claimed by user')

    const updatedReward = await Reward.findByIdAndUpdate(id, { issued: true, issueDate: new Date(), status: "Paid" }, {
        new: true,
    });

    if(!updatedReward.issued) throw new Error('Reward Issuance Error - DB Error')

    // const newTransaction = await walletTransactionService.saveWalletTransaction({ userId: userId, isInflow: false, value: updatedReward.value, description: "Withdrawal of rewards", status: "successful", type: updatedReward.type })
    

    return updatedReward
}

const getRewards = (Reward) => async () => {
    const rewards = await Reward.find();

    return rewards;
}


const getRewardsByUser = (Reward) => async (userId) => {

    // console.log('uid: ', userId)

    const rewards = await Reward
                .find({ "userId": userId})
                .populate('gameWeek', {id: 1, title: 1});


    let data = {  };
    let available = [], claimed = [];

    rewards.forEach(function (doc) {
        
        if (doc.claimed) {
            claimed.push(doc);
        }else{
            available.push(doc);
        }
    })
    data.available = available;
    data.claimed = claimed;


    return data;
}





module.exports = (Reward) => {
    return {
        saveReward: saveReward(Reward),
        getRewards: getRewards(Reward),
        getRewardsByUser: getRewardsByUser(Reward),
        claimReward: claimReward(Reward),
        issueReward: issueReward(Reward)
    }
}