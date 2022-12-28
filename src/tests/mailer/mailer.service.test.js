require("dotenv").config()

const { mailerService } = require('../../mailer')

describe('Mailer Service', () => {


    describe('sendMail', () => {
        it('should send mail', async () => {

            const mailData = {
                to: 'orefaseru@gmail.com', subject: 'Test MAil', message: 'testing this email', from: 'alerts@soccerwiztrivia.com'
            }

            let response = await mailerService.sendMail(mailData)

            // console.log('mail: ', response)

            expect(response).not.toBeNull()
        })

    })


})