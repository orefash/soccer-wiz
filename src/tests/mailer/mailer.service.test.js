require("dotenv").config()
const AWS = require('aws-sdk');

const { mailerService } = require('../../mailer')

jest.mock("aws-sdk", () => {
    return {
      config: {
        update() {
          return {};
        },
      },
    //   SecretsManager: jest.fn(() => {
    //     return {
    //       getSecretValue: jest.fn(({ SecretId }) => {
    //         return {
    //           promise: () => mockgetSecretValue(SecretId),
    //         };
    //       }),
    //     };
    //   }),

      SES: jest.fn(() => {
        return {
            sendEmail: jest.fn((data) => {
            return {
              promise: () => { resp: "done"},
            };
          }),
        };
      }),
    };
  });

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