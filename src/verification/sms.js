const Nexmo = require('nexmo');
const User = require('../models/user');

const nexmo = new Nexmo({
    apiKey: process.env.SMS_API_KEY,
    apiSecret: process.env.SMS_API_SECRET,
});


sendVerificationMessage = (user) => {
    const to = user.phoneNumber

    /// generate rondom code and send it to user 
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const from = 'Qurba company';
    const text = `This is the verification code ${randomNumber}`;
 
    /// assign random code to user body to compare with entered one
    user.code = randomNumber
    /// send message
    nexmo.message.sendSms(from, to, text)
}

module.exports = sendVerificationMessage