
const MailerService = require('./mailer.service')

const mailerService = MailerService();

module.exports = {
    mailerService: mailerService,
}