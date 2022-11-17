

const saveReward = (Reward) => async ({ gameWeek, userId, value, currency, type }) => {

    
    const newReward = new Reward({ gameWeek, userId, value, issueDate: new Date(), currency, type })

    return newReward.save()
}

const claimReward = (Reward, walletTransactionService) => async ({rewardId, userId}) => {

    const rewards = await Reward.findOne({ _id: rewardId })

    // console.log("Rewards; ", rewards)
    if(rewards.claimed) throw new Error("Reward already claimed")

    if(rewards.userId !== userId) throw new Error('Invalid User')

    const updatedReward = await Reward.findByIdAndUpdate(rewardId, { claimed: true, claimDate: new Date() }, {
        new: true,
    });

    // console.log("Up Rewards; ", rewards)

    if(updatedReward.claimed){
        const newTransaction = await walletTransactionService.saveWalletTransaction({ userId: userId, isInflow: false, value: updatedReward.value, description: "Withdrawal of rewards", status: "successful", type: updatedReward.type })
    }

    return updatedReward
}


const issueReward = (Reward) => async (id) => {

    const rewards = await Reward.findOne({ _id: id })

    // if(rewards.userId !== uid) throw new Error('Invalid User')
    if(rewards.claimed !== true) throw new Error('Reward not claimed by user')

    const updatedReward = await Reward.findByIdAndUpdate(id, { issued: true, issueDate: new Date() }, {
        new: true,
    });

    return updatedReward
}

const getRewards = (Reward) => async () => {
    const rewards = await Reward.find();

    return rewards;
}


const getRewardsByUser = (Reward) => async (userId) => {

    // console.log('uid: ', userId)

    const rewards = await Reward.find({ "userId": userId});

    // console.log("Re: ", rewards)s

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





module.exports = (Reward, walletTransactionService) => {
    return {
        saveReward: saveReward(Reward),
        getRewards: getRewards(Reward),
        getRewardsByUser: getRewardsByUser(Reward),
        claimReward: claimReward(Reward, walletTransactionService),
        issueReward: issueReward(Reward)
    }
}