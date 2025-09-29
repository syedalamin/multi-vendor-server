import nodemailer from "nodemailer";
import config from "../config";

const sendToEmail = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.sendMail.email,
      pass: config.sendMail.app_pass,
    },
  });

  await transporter.sendMail({
    from: "Trusty Shop",
    to: email,
    subject: "Reset Password Link",
    html,
  });
};
export default sendToEmail;
