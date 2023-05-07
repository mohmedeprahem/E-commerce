// nodemailer.service.js
const nodemailer = require('nodemailer');

class NodemailerService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });
  }

  async sendEmail(data, to) {
    // Send the email using nodemailer
    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject: 'Verify account :)',
      text: `your OTP is ${data}`,
    };
    const result = await this.transporter.sendMail(mailOptions);

    return result;
  }
}

module.exports = new NodemailerService();