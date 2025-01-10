import nodemailer from "nodemailer";
import { emailAddress, emailPassword, toEmail } from "../config/index.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: emailAddress,
    pass: emailPassword,
  },
});

const sendMail = async (bcc, sub, body) => {
  try {
    const mail = await transporter.sendMail({
      from: emailAddress,
      to: toEmail,
      bcc: bcc,
      subject: sub,
      html: body,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export default sendMail;
