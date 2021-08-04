const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
}));

const sendMail = (to, subject, text) => {
    var opts = {
        from: process.env.EMAIL,
        to,
        subject,
        text
    }
    transporter.sendMail(opts, (err, data) => {
        if(err) {
            console.log('ERROR MAILING: ', err)
        } else {
            console.log('Email is sent to ', to);
        }
    })
}

module.exports = sendMail;