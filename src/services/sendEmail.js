const nodemailer = require('nodemailer');

const sendeEmail = async (templateUsed, email, link, userName, pageLink) => {
    // 1-)CREATE TRANSPORTER
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });
    // -2)EMAIL OPTIONS
    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Readify email service',
        html: templateUsed(link, userName, pageLink),
    };
    // 3-)SEND AN EMAIL
    await transporter.sendMail(mailOptions);
};

module.exports = sendeEmail;
