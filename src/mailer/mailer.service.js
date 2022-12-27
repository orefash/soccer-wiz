const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEYID,
    secretAccessKey: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const sendMail = () => async ({ to, subject, message, from }) => {

    try{

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

        ses.sendEmail(params, (err, data) => {
            if (err) {
                return console.log(err, err.stack);
            } else {
                console.log("Email sent.", data);
            }
        });

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