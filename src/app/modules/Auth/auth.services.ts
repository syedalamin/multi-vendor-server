import { UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import status from "http-status";
import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../../config";
import { Token, TTokenPayload } from "../../../utils/authToken/generateToken";
import ApiError from "../../../utils/share/apiError";
import prisma from "../../../utils/share/prisma";
import sendToEmail from "../../../utils/sendToEmail";
type TLogin = {
  email: string;
  password: string;
};

const login = async (payload: TLogin) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: Boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(status.NOT_FOUND, "Password Do Not Match");
  }

  const tokenPayload: TTokenPayload = {
    email: userData.email,
    role: userData.role,
  };

  const accessToken = Token.generateToken(
    tokenPayload,
    config.jwt.access_Token as string,
    config.jwt.access_Token_expires_in as string
  );
  const refreshToken = Token.generateToken(
    tokenPayload,
    config.jwt.refresh_Token as string,
    config.jwt.refresh_Token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  const verifiedUser = Token.verifyToken(
    token,
    config.jwt.refresh_Token as Secret
  );

  if (!verifiedUser) {
    throw new ApiError(status.UNAUTHORIZED, "You are not AuthorizedF");
  }

  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: verifiedUser.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(status.UNAUTHORIZED, "You are not authorized");
  }

  const tokenPayload: TTokenPayload = {
    email: userData.email,
    role: userData.role,
  };
  const accessToken = Token.generateToken(
    tokenPayload,
    config.jwt.access_Token as Secret,
    config.jwt.access_Token_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (
  user: JwtPayload | undefined,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      password: true,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(status.UNAUTHORIZED, "Password Do Not Match");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: user?.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password Change Successfully",
  };
};

const forgetPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      admin: true,
      customer: true,
    },
  });

  if (!userData) {
    throw new ApiError(status.UNAUTHORIZED, "You are not authorized");
  }

  const tokenPayload: TTokenPayload = {
    email: userData.email,
    role: userData.role,
  };
  const accessToken = Token.generateToken(
    tokenPayload,
    config.jwt.reset_Token as Secret,
    config.jwt.reset_Token_expires_in as string
  );

  const resetPassLink =
    config.sendMail.reset_pass_link +
    `?userId=${userData.id}&token=${accessToken}`;

  return {
    accessToken,
  };
  //! it will be solved
  // await sendToEmail(
  //   userData.email,
  //   `
  //   <div style="font-family: Arial, sans-serif; color: #333;">
  //     <p>Dear ${userData.admin?.name || "User"},</p>

  //     <p>We received a request to reset your password. To proceed, please click the button below:</p>

  //     <p style="margin: 20px 0;">
  //       <a href="${resetPassLink}" style="text-decoration: none;">
  //         <button style="padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
  //           Reset Password
  //         </button>
  //       </a>
  //     </p>

  //     <p>If you did not request this, you can safely ignore this email. Your password will remain unchanged.</p>

  //     <p>Best regards,<br/>Team Chotto Haat</p>

  //     <hr style="margin-top: 30px;" />
  //     <small style="color: #888;">This is an automated message from Chotto Haat. Please do not reply directly to this email.</small>
  //   </div>
  // `
  // );
};

const resetPassword = async (
  token: string,
  payload: { id: string; newPassword: string }
) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(status.UNAUTHORIZED, "You are not authorized");
  }
  const verifiedUser = Token.verifyToken(
    token,
    config.jwt.reset_Token as Secret
  );
  if (!verifiedUser) {
    throw new ApiError(status.UNAUTHORIZED, "You are not AuthorizedF");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: verifiedUser?.email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return {
    message: "Password Reset Successfully",
  };
};
export const AuthServices = {
  login,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
