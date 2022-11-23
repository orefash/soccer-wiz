

const saveScore = (DailyScore, WeeklyScore, MonthlyScore) => async ({ score, category, gameWeek, date = Date.now(), userId, username }) => {

    // const existing = await GameCategory.findOne({ category: data.category })
    let data = { daily: false, weekly: false, monthly: false }

    const daily = await scoreCheck(DailyScore, { category, username });

    // console.log(`daily - ${username} : `, daily)

    if (daily && daily.score >= score) return data

    let scoreData = {
        score, category, userId, username, id: daily
    }

    const updateDaily = await saveOrUpdate(DailyScore, scoreData);
    // console.log(`Before Daily: ${daily}`)
    // console.log(`After Daily: ${updateDaily}`)

    data.daily = true;


    const weekly = await scoreCheck(WeeklyScore, { category, username });

    if (weekly && weekly.score >= score) return data

    scoreData.id = weekly;

    const updateWeekly = await saveOrUpdate(WeeklyScore, scoreData);
    // console.log(`Before weekly: ${weekly}`)
    // console.log(`After weekly: ${updateWeekly}`)

    data.weekly = true;


    const monthly = await scoreCheck(MonthlyScore, { category, username });

    if (monthly && monthly.score >= score) return data

    scoreData.id = monthly;

    const updateMonthly = await saveOrUpdate(MonthlyScore, scoreData);
    // console.log(`Before monthly: ${monthly}`)
    // console.log(`After monthly: ${updateMonthly}`)

    data.monthly = true;

    return data;

}

const saveOrUpdate = async (Model, { score, userId, category, username, id }) => {

    // console.log(`id - m ${username}: `, id)
    if (id) {
        let data = await Model.findByIdAndUpdate(id._id, { score }, {
            new: true,
        });
        return data;
    }

    const newScore = new Model({ score, userId, category, username })

    return newScore.save()

}

const scoreCheck = async (Model, { category, username }) => {
    let data = await Model.findOne({ category: category, username: username });

    return data
}


const getScores = (DailyScore, WeeklyScore, MonthlyScore) => async (period) => {

    const periods = {
        1: DailyScore,
        2: WeeklyScore,
        3: MonthlyScore
    }

    // console.log(' period: ', Object.keys(periods))

    if (!Object.keys(periods).includes(period)) throw new Error('Invalid Period')

    let Model = periods[period];
    // console.log('in leaderboard: - model ', Model)

    const leaderboard = await Model.find();

    return leaderboard;
}

const getLeaderboardByCategory = (DailyScore, WeeklyScore, MonthlyScore) => async ({ period, userId, username, category }) => {

    const periods = {
        1: {model: DailyScore, period: 'daily'},
        2: {model: WeeklyScore, period: 'weekly'},
        3: {model: MonthlyScore, period: 'monthly'}
    }

    // console.log(' period: ', Object.keys(periods))

    if (!Object.keys(periods).includes(period)) throw new Error('Invalid Period')

    let Model = periods[period].model;
    // console.log('in leaderboard: - model ', Model)

    const leaderboard = await Model.find({ category }, { createdAt: 0, updatedAt: 0, _id: 0, __v: 0}).sort({ score: -1 });

    let userRank = null;
    let docCount = 0;
    if (leaderboard.length === 0) return { leaderboard: [], userId: userId, rank: null }

    leaderboard.forEach(function (doc) {
        docCount++;
        if (userId == doc.userId) {
            userRank = docCount;
            return
        }
    })


    return { leaderboard: leaderboard, userId, username, rank: userRank, period: periods[period].period };
}



const getMatchdayLeaderboard = (WeeklyScore) => async ({ userId, username }) => {

    const leaderboard = await WeeklyScore.aggregate([
        {
            $group: {
                "_id": "$username",
                "username": { "$first": "$username" },
                score: {
                    $max: "$score"
                }
            }
        },
        {
            $sort: {
                "score": -1
            }
        }
    ])

    let userRank = null;
    let docCount = 0;
    if (leaderboard.length === 0) return { leaderboard: [], userId: userId, rank: null }

    leaderboard.forEach(function (doc) {
        docCount++;
        if (username == doc._id) {
            userRank = docCount;
            return
        }
    })


    return { leaderboard: leaderboard, userId, username, rank: userRank };
}




const deleteScores = (DailyScore, WeeklyScore, MonthlyScore) => async (period) => {

    const periods = {
        1: DailyScore,
        2: WeeklyScore,
        3: MonthlyScore
    }

    // console.log(' period: ', period)

    // console.log(' periods: ', Object.keys(periods))

    // Object.keys(periods)

    if (!Object.keys(periods).includes(period)) throw new Error('Invalid Period')

    let Model = periods[period];
    // console.log('in leaderboard: - model ', Model)

    const data = await Model.deleteMany({});

    return data;
}


module.exports = (DailyScore, WeeklyScore, MonthlyScore, Score) => {
    return {

        saveScore: saveScore(DailyScore, WeeklyScore, MonthlyScore),
        getLeaderboardByCategory: getLeaderboardByCategory(DailyScore, WeeklyScore, MonthlyScore),
        getScores: getScores(DailyScore, WeeklyScore, MonthlyScore),
        getMatchdayLeaderboard: getMatchdayLeaderboard(WeeklyScore),
        deleteScores: deleteScores(DailyScore, WeeklyScore, MonthlyScore)
    }
}