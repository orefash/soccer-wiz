
//googleapis
const { google } = require("googleapis");



const loadQuestionsFromGoogleSheets = async (spreadsheetId, sheetRange = "Sheet1!A:B") => {

    const cred = {
        "type": "service_account",
        "project_id": "deep-clock-364111",
        "private_key_id": "f73713f40f5c95752fd45d7232c2c1991d89fa9a",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDaZaDXCFJ2lZ8P\n6SmCtRzW6YseEyUzaBOyTl1CHaywtkHFJlDSS1PN/+bg3SBPGgaK7sU9DVHA6l38\nf4AW1dStAv+Bwhe6jkcP/tSRDhf56s1YteYSm0MXyNG5okV+oQNuLpyY71NwmtZU\nkjOEBKj8Udi5cw919xruGcFPBP9Xek93u3rBfJqoiA0e4PQeE5m58HkVsMyU4leK\nTOKn8Mrnjq/lwUi2mx3LcCyyJviFveEqe33W9A7EIHH+LgBLgBWVjHePKzY/jjZR\no4KU8aBz28AdWMbsYI4o87jQGzubEVMuBUt9J8vhAqCniTqYPiPTJ/p2bqcaqxaF\nNfe9mX7bAgMBAAECggEAGKStEHaE75KUfzQdFf2fwnRZ2Uvpv7I3vr/u7/3vNYVr\nSHa5WfFcBHuirq7k7WgPYu/sW6Y8GluXvV0Zs/nu5JLZB+hByzAwvpJPpAqGFBI1\nl5P24RSZ7n4fhCXWV6KNg4pI60zeCm++TY6tt3DbLJWDsfFUxkfaxxEq6eKzeUhD\neVgWuEIUSDeKEANDuhsUvoGOJ736St9KrqUiUxC6KguQA21pN48B1qKiy7GZuASE\nAgU0vCGlYSlcJaJ8Uvp2kWbHodsfttIvVXr/vhSPoxey3OWRkryPuFBy1gcNmoTR\ns0FjtQubaqJQdh6q7a1P+ZkKxWGRPjQHhgpx6+/6wQKBgQD0Tx6jCfNLw2nDWgkE\nDg3TqD4wBH5JPRhsgZKDtvk2Kq85oaAeGrs8SnllNba2JBThk9IKERLvlhxz9yNp\n+eSfWGBTVE055VJwWQAg+WfXvcC5Zj/+LRFFo89/z5Q2w5/KADhmeh1GgGr9BWHP\n3xsHVVrDE3pc2kxFEzExRQrm+wKBgQDk2RNfVpQOQMIgGrgq3aAbGu3XD1LGnGGh\nKVgyAA8LRxPNZmL8z3KUAahAMAXdK/WkSEeGxD04+hAh7THGsttHTTkfQfAJXukQ\nytO8IX/S5qm5HZ7PCYaoADPdYupiovKwHx6Ga6VRD6ow7dMNGq6rHuDmtkSd5X0e\nS31rleHBoQKBgQCFomGXvPGgF5vah303Apj9laGukkahuRGLCLUj5woaXu7KD2aO\nEQEp0XLlsaPnrYTefwT9DKnW871MkXqFlXNA1g6ahhpX+OBHI+e2IbZzhA/PWebX\nGb/A4AG4X8sqyYa177jqFRG+ZrAfBrqiAd+++ylSW20rLR1bC0x1Ltbv0QKBgC14\nrI6/B0AlwezbIkjyLIP2P9gBpXLtU8DQFEQrGtIk11xywax2E9Aw3BuU7zVZLL/t\n1LiEeZ2+okH7fW57z3JFd9osIePaxfieNKAnD9z6FDNCHXIJ9IWhNK0CoIvk0NAJ\n/ui6ruiCclCykMMD0D0UL5/oC45MMSY53bvo1ijBAoGAZVIbVgK4PxVV+4OCdZqv\nfBdwtriPyDQpL9bi6jgjsD4IdnhMuw8axiNu6pTbkd5YLGIbVf/Lkhbzr03WOovW\nc7RWBnKLEVvEU/StU2Syne1pryIvYiKa+i057Lg/JKNFTIqOYwuethQzTCw/gQMz\nh5eBzl0gWmQGl6xg6S7QqeM=\n-----END PRIVATE KEY-----\n",
        "client_email": "soccerwiz-q@deep-clock-364111.iam.gserviceaccount.com",
        "client_id": "104761598312264682102",
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

    // spreadsheet id
    // const spreadsheetId = "1gcEYWtiZK-CxFxVpQ9soMYFAnrQxEARrY0RUbq19GZ0";
    // const spreadsheetId = process.env.SPREADSHEET_ID;

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
        if (question && question.length == 6) {

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