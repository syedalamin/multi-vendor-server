import nodemailer from "nodemailer";
import config from "../config";

const sendToEmail = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: config.sendMail.email,
      pass: config.sendMail.app_pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Chotto Haat" <chottohaat@gmail.com>',
    to: email,
    subject: "Reset Password Link",
    html, // HTML body
  });

  console.log("Message sent:", info.messageId);
};
export default sendToEmail;