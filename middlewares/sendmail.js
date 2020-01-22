const nodemailer = require("nodemailer");

const SNEDER_MAIL = process.env.SNEDER_MAIL || "skrwebstart@gmail.com";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SNEDER_MAIL,
    pass: EMAIL_PASSWORD
  }
});

function sendMail(receiver, subject, text, html) {
  return transport.sendMail({
    from: SNEDER_MAIL,
    to: receiver,
    subject: subject,
    text: text,
    html: html
  });
}

module.exports = sendMail;
