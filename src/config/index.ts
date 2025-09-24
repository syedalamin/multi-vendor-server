import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  jwt: {
    access_Token: process.env.ACCESS_TOKEN,
    access_Token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refresh_Token: process.env.REFRESH_TOKEN,
    refresh_Token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_Token: process.env.RESET_TOKEN,
    reset_Token_expires_in: process.env.RESET_TOKEN_EXPIRES_IN,
  },
  sendMail: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
    reset_pass_link: process.env.RESET_PASS_LINK,
  },
};
