
const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { ScoreService, DailyScore, WeeklyScore, MonthlyScore, Score } = require('../../score')

const getCategoryByName = jest.fn();
when(getCategoryByName).calledWith('EFL').mockReturnValue(true)
when(getCategoryByName).calledWith('PL').mockReturnValue(true)

let gameCategoryService = {
    getCategoryByName: getCategoryByName
}

const scoreService = ScoreService(DailyScore, WeeklyScore, MonthlyScore, Score, gameCategoryService);

beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())

let user1 = '636b0910df08da51e672f882', user2 = '636b091adf08da51e672f888', user3 = '636d5bebb89af4cd04c6db80', user4 = '636d7bebb89af4cd04c6db80';;

const score1 = {
    userId: user1,
    username: 'user1',
    category: 'PL',
    date: Date.now(),
    score: 12
}

const score2 = {
    userId: user1,
    username: 'user1',
    category: 'PL',
    date: Date.now(),
    score: 15
}

const score3 = {
    userId: user1,
    username: 'user1',
    category: 'EFL',
    date: Date.now(),
    score: 12
}

const score4 = {
    userId: user2,
    username: 'user2',
    category: 'PL',
    date: Date.now(),
    score: 12
}

const score5 = {
    userId: user3,
    username: 'user3',
    category: 'PL',
    date: Date.now(),
    score: 16
}

const score6 = {
    userId: user3,
    username: 'user3',
    category: 'EFL',
    date: Date.now(),
    score: 16
}

const score7 = {
    userId: user3,
    username: 'user3',
    category: 'PL',
    date: Date.now(),
    score: 11
}

const score8 = {
    userId: user2,
    username: 'user2',
    category: 'EFL',
    date: Date.now(),
    score: 19
}

const score9 = {
    userId: user1,
    username: 'user1',
    category: 'EFL',
    date: Date.now(),
    score: 18
}

const score10 = {
    userId: user4,
    username: 'user4',
    category: 'PL',
    date: Date.now(),
    score: 18
}

describe('Score Service', () => {

    describe('saveScore', () => {
        it('should save score details in daily, weekly and monthly collections if greater than previous', async () => {
            let s1 = await scoreService.saveScore(score1)

            console.log('s1: ',s1)

            let s2 = await scoreService.saveScore(score2)

            console.log('s2: ',s2)

            let s5 = await scoreService.saveScore(score5)

            console.log('s5: ',s5)

            let daily1 = await DailyScore.find()

            console.log("S5 End Daily list: ", daily1)

            let s7 = await scoreService.saveScore(score7)

            console.log('s7: ',s7)

            let daily = await DailyScore.find()

            // console.log("End Daily list: ", daily)

            expect(s1.daily).toBe(true);
            expect(s2.daily).toBe(true);
            expect(s5.daily).toBe(true);
            expect(s7.daily).toBe(false);

        })



    })


    describe('deleteScores', () => {
        it('should delete all score records in particular collection - daily/weekly/monthly', async () => {
            let s1 = await scoreService.saveScore(score1)

            // console.log('s1: ',s1)

            let s2 = await scoreService.saveScore(score2)

            // console.log('s2: ',s2)

            let s5 = await scoreService.saveScore(score5)

            // console.log('s5: ',s5)

            // let daily1 = await DailyScore.find()

            // console.log("S5 End Daily list: ", daily1)

            let s7 = await scoreService.saveScore(score7)

            // console.log('s7: ',s7)

            let daily = await DailyScore.find()

            // console.log("End Daily list: ", daily.length)

            let deletedDaily = await scoreService.deleteScores('1');

            let postDeleteDaily = await DailyScore.find()


            // console.log("Deleted Daily list: ", deletedDaily)

            expect(daily.length).toBe(2);
            expect(deletedDaily.deletedCount).toBe(2);
            expect(postDeleteDaily.length).toBe(0);

        })



    })

    describe('deleteAllScores', () => {
        it('should delete all score records - daily/weekly/monthly', async () => {
            let s1 = await scoreService.saveScore(score1)

            let s2 = await scoreService.saveScore(score2)

            let s5 = await scoreService.saveScore(score5)

            let s7 = await scoreService.saveScore(score7)


            let daily = await DailyScore.find()
            let weekly = await WeeklyScore.find()
            let monthly = await MonthlyScore.find()

            // console.log("End Daily list: ", daily)
            // console.log("End Weekly list: ", weekly)
            // console.log("End Monthly list: ", monthly)

            await scoreService.deleteAllScores();

            let postDeleteDaily = await DailyScore.find()
            let postWeekly = await WeeklyScore.find()
            let postMonthly = await MonthlyScore.find()

            // console.log("Deleted Daily list: ", deletedDaily)

            expect(daily.length).toBe(2);
            expect(weekly.length).toBe(2);
            expect(monthly.length).toBe(2);
            expect(postDeleteDaily.length).toBe(0);
            expect(postWeekly.length).toBe(0);
            expect(postMonthly.length).toBe(0);

        })



    })


    describe('getLeaderboardByCategory', () => {
        it('should return daily leaderboard by Category ', async () => {

            let s1 = await scoreService.saveScore(score1)

            let s2 = await scoreService.saveScore(score2)
            let s3 = await scoreService.saveScore(score3)
            let s4 = await scoreService.saveScore(score4)

            let s5 = await scoreService.saveScore(score5)

            let s6 = await scoreService.saveScore(score6)

            let s7 = await scoreService.saveScore(score7)
            let s8 = await scoreService.saveScore(score10)

            let category = 'PL'

            let leaderboard = await scoreService.getLeaderboardByCategory({ period: '1', userId: user2, category })

            // console.log('PL leaderboard: ', leaderboard);

            expect(leaderboard.leaderboard.length).toBe(4)

        });

        it('should throw error when invalid period is passed', async () => {

            let s1 = await scoreService.saveScore(score1)

            let s2 = await scoreService.saveScore(score2)
            let s3 = await scoreService.saveScore(score3)
            let s4 = await scoreService.saveScore(score4)

            let s5 = await scoreService.saveScore(score5)

            let s6 = await scoreService.saveScore(score6)

            let s7 = await scoreService.saveScore(score7)

            let category = 'PL'

            await expect( scoreService.getLeaderboardByCategory({ period: '5', userId: user2, username: 'user2', category })).rejects.toThrow()

        });

        it('should throw error when no userID is passed', async () => {

            let s1 = await scoreService.saveScore(score1)

            let s2 = await scoreService.saveScore(score2)
            let s3 = await scoreService.saveScore(score3)
            let s4 = await scoreService.saveScore(score4)

            let s5 = await scoreService.saveScore(score5)

            let s6 = await scoreService.saveScore(score6)

            let s7 = await scoreService.saveScore(score7)

            let category = 'PL'

            await expect( scoreService.getLeaderboardByCategory({ period: '5', username: 'user2', category })).rejects.toThrow()

        });
    })



    describe('getMatchdayLeaderboard', () => {
        it('should return matchday leaderboard', async () => {

            let s1 = await scoreService.saveScore(score1)

            let s2 = await scoreService.saveScore(score2)
            let s3 = await scoreService.saveScore(score3)
            let s4 = await scoreService.saveScore(score4)

            let s5 = await scoreService.saveScore(score5)

            let s6 = await scoreService.saveScore(score6)

            let s7 = await scoreService.saveScore(score7)

            let s8 = await scoreService.saveScore(score8)

            let s9 = await scoreService.saveScore(score9)


            let leaderboard = await scoreService.getMatchdayLeaderboard({ userId: user2, username: 'user2'})

            // console.log('leaderboard: ', leaderboard);

            expect(leaderboard.leaderboard.length).toBe(3)

        });

      
    })



    describe('getScores', () => {
        it('should return all scores depending period', async () => {

            let s1 = await scoreService.saveScore(score1)

            let s2 = await scoreService.saveScore(score2)
            let s3 = await scoreService.saveScore(score3)
            let s4 = await scoreService.saveScore(score4)

            let s5 = await scoreService.saveScore(score5)

            let s6 = await scoreService.saveScore(score6)

            let s7 = await scoreService.saveScore(score7)

            let s8 = await scoreService.saveScore(score8)

            let s9 = await scoreService.saveScore(score9)


            let scores = await scoreService.getScores('1')

            // console.log('scores: ', scores);

            expect(scores.length).toBe(6)

        });

      
    })


})