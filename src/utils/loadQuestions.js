"use strict";
require("dotenv").config();
//googleapis
const { google } = require("googleapis");



const loadQuestionsFromGoogleSheets = async (spreadsheetId, sheetRange = "Sheet1!A:B") => {

    const cred = {
        "type": "service_account",
        "project_id": "deep-clock-364111",
        "private_key_id": process.env.GOOGLE_PK_ID,
        "private_key": process.env.GOOGLE_SECRET.replace(new RegExp("\\\\n", "\g"), "\n"),
        "client_email": process.env.GOOGLE_CLIENT_EMAIL,
        "client_id": process.env.GOOGLE_CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/soccerwiz-q%40deep-clock-364111.iam.gserviceaccount.com"
    }

    const auth = new google.auth.GoogleAuth({
        // keyFile: "", //the key file
        credentials: cred,
        //url to spreadsheets API
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    //Auth client Object
    const authClientObject = await auth.getClient();

    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });


    const readData = await googleSheetsInstance.spreadsheets.values.get({
        auth, //auth object
        spreadsheetId, // spreadsheet id
        range: sheetRange, //range of cells to read from.
        // range: "Sheet1!A:B", //range of cells to read from.
    })

    return readData.data.values;

}

const formatDataForQuestionService = async (data, category) => {

    // console.log("Array d: ", data)

    if (!data || !Array.isArray(data) || data.length < 2) throw new Error('Invalid data')

    data.shift();// remove first element from array

    // console.log("data post shift: ", data);

    let questions = []

    let options = {
        'a': 1, 'b': 2, 'c': 3, 'd': 4
    }

    data.forEach((question) => {
        let q = {}
        if (question && question.length == 7) {

            let answers = []
            q.category = category;
            q.question = question[0]
            for (let i = 1; i < 5; i++) {
                let a = {}
                a.optionNumber = i
                a.answerText = question[i]
                if (options[question[5].toLowerCase()] == i) {
                    a.isCorrect = true
                }
                else a.isCorrect = false
                answers.push(a)
            }
            q.answers = answers
            q.gameWeek = question[6]
            questions.push(q)
        }
        
    })

    return questions

}

// module.exports.loadQuestionData = readData

module.exports = {
    loadQuestionsFromGoogleSheets: loadQuestionsFromGoogleSheets,
    formatDataForQuestionService: formatDataForQuestionService
}