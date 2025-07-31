import { UserRole } from "@prisma/client";

import jwt, { JwtPayload, Secret } from "jsonwebtoken";
export type TTokenPayload = {
  email: string;
  role: UserRole;
};

const generateToken = (
  payload: TTokenPayload,
  secret: Secret | string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const Token = {
  generateToken,
  verifyToken,
};
