
module.exports = {
    questionData: (gameWeek, category, valid = true ) => {

        let data = {
            "active": true,
            "points": 1,
            gameWeek: gameWeek,
            "question": "How many Ballon'Dor does Messi have?",
            "category": category,
            "answers": [
                {
                    "optionNumber": 1,
                    "answerText": "5",
                    "isCorrect": false
                },
                {
                    "optionNumber": 2,
                    "answerText": "7",
                    "isCorrect": true
                },
                {
                    "optionNumber": 3,
                    "answerText": "2",
                    "isCorrect": false
                },
                {
                    "optionNumber": 3,
                    "answerText": "2",
                    "isCorrect": false
                }
            ]
        }

        if(!valid){
            data.answers.pop();
        }

        return data;
    }

}