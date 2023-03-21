
require("dotenv").config();

const { loadQuestionsFromGoogleSheets, formatDataForQuestionService } = require('../../utils/loadQuestions');


describe('Load Questions from sources ', () => {


    describe('Load Questions from google ', () => {


        it('should return test question data', async () => {

            const data = await loadQuestionsFromGoogleSheets("1gcEYWtiZK-CxFxVpQ9soMYFAnrQxEARrY0RUbq19GZ0" ,"Sheet1!A:B");

            // console.log("Data: ", data)

            expect(data.length).toBe(5)
    
        })


    })


    describe('Load Format data for database storage ', () => {


        it('should return formatted question data', async () => {

            // const data = await loadQuestionsFromGoogleSheets("1UF0iskvv8mfenwV8_FOwF5JYB13O2fIAsJ9oU3xBLVQ" ,"Sheet1!A:F");

            // console.log("Data: ", data.values)

            let testD = [
                [
                  'Questions',
                  'Option A',
                  'Option B',
                  'Option C',
                  'Option D',
                  'Correct',
                  'gameweek'
                ],
                [
                  'How many goals did Karim Benzema score against PSG in the 2021-22 champions league round of 16 second leg?',
                  '2',
                  '3',
                  '0',
                  '1',
                  'A',
                  '2'
                ],
                [
                  'Who replaced Nuno Espiranto Santo as Tottenham coach in the 2021-22 premier league season?',
                  'Antonio Conte',
                  'Mikel Arteta',
                  'Eddie Howe',
                  'Thomas Tuchel',
                  'A',
                  '2'
                ],
                [
                  'Which club did Alexandre Lacazette play for in the 2021-22 season?',
                  'Man Utd',
                  'Brighton',
                  'Southampton',
                  'Arsenal',
                  'D',
                  '2'
                ],
                [
                  'Which of these players scored the first goal for Liverpool in the 2021-22 premier league season?',
                  'Mo Salah',
                  'Jordan Henderson',
                  'Diogo Jota',
                  'Joel Matip',
                  'C',
                  '2'
                ]
            ]

            // expect(data.values.length).toBe(5)

            const formatedData = await formatDataForQuestionService(testD, 'demo', "gameweek")

            // console.log("formatted Data: ", JSON.stringify(formatedData))
    
            expect(formatedData.length).toBe(4)
        })

        
    })
})