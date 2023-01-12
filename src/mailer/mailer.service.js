"use strict";
const AWS = require('aws-sdk');

const sendMail = () => async ({ to, subject, message, from }) => {

    const cred = {
        accessKeyId: process.env.AWS_ACCESS_KEYID,
        secretAccessKey: process.env.AWS_ACCESS_KEY,
        region: process.env.AWS_REGION
    }


    AWS.config.update(cred);

    try{
        const ses = new AWS.SES({ apiVersion: '2010-12-01' });

        const params = {
            Destination: {
                ToAddresses: [to]
            },
            Message: {
                Body: {
                    // Html: {
                    //     Charset: 'UTF-8',
                    //     Data: message
                    // },
                    //replace the Html attribute with the following if you want to send plain text emails. 
                    Text: {
                        Charset: "UTF-8",
                        Data: message
                    }
                 
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            ReturnPath: from,
            Source: from,
        };

        // await ses.sendEmail(params, (err, data) => {
        //     if (err) {
        //         return console.log(err, err.stack);
        //     } else {
        //         console.log("Email sent.", data);
        //         return data;
        //     }
        // });

        let data = await ses.sendEmail(params).promise();

        // console.log("data: ", data)

        return data;

    }catch(error){
        console.log('Send mail: ', error.message)
        throw new Error('Send Mail: ', error.message)
    }

}


module.exports = () => {
    return {
        sendMail: sendMail(),
    }
}