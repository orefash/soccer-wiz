"use strict";
const { calcGameScore } = require('../../utils/gameScores');

const gameAnswers1 = [
    {
        timeTaken: 5,
        isCorrect: true
    },
    {
        timeTaken: 5,
        isCorrect: false
    },
    {
        timeTaken: 2,
        isCorrect: true
    },
    {
        timeTaken: 8,
        isCorrect: false
    },
    {
        timeTaken: 9,
        isCorrect: true
    },
    {
        timeTaken: 5,
        isCorrect: true
    }
];


describe('Game Scores', () => {


    describe('calcGameScore', () => {
        it('should return game score details', async () => {
            let scores = await calcGameScore(gameAnswers1);

            console.log("score: ", scores)

            expect(scores).toBeDefined();
            expect(scores.noOfCorrect).toEqual(4);
            expect(scores.noOfQuestions).toEqual(6);
            expect(scores.speedBonus).toEqual(0.9);
            expect(scores.totalScore).toEqual(4.9);



        })
    })

})