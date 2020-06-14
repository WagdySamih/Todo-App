const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS, 
        pass: process.env.EMAIL_PASSWORD 
    }
});



const sendVerificationEmail = async(user, req) => {

    const verifyToken =await user.generateAuthToken()
    const url = `${req.protocol}://${req.get('host')}/user/email/confirm/${verifyToken}`
    const message = `You are receiving this email because you trying to verificate your account
    Please click this link to confirm \n\n${url}`


    transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: req.user.email,
        subject: 'Verification Email',
        text: message
    })
}
module.exports = sendVerificationEmail