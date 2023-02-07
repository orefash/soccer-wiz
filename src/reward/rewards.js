
const rewards = {
    't1': {
        type: 'airtime',
        value: 2000,
        currency: 'NGN',
        tier: 1
    },
    't2': {
        type: 'cash',
        value: 3000,
        currency: 'NGN',
        tier: 2
    },
    't3': {
        type: 'cash',
        value: 5000,
        currency: 'NGN',
        tier: 3
    }

}

const getReward = (score) => {
    
    if(score < 16) return null
    else if(score >= 16 && score < 19){
        return rewards.t1;
    }
    else if(score >= 19 && score < 22.5){
        return rewards.t2;
    }

    return rewards.t3;
}

module.exports = {
    rewards: rewards,
    getReward: getReward
};