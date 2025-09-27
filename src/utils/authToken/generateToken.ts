import { UserRole } from "@prisma/client";

import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
export type TTokenPayload = {
  email: string;
  role: UserRole;
};

const generateToken = (
  payload: TTokenPayload,
  secret: Secret | string,
  expiresIn?: number | string
) => {
  const options: SignOptions = {
    algorithm: "HS256",
    ...(expiresIn ? { expiresIn: expiresIn as any } : {}),
  };

  const token = jwt.sign(payload, secret, options);

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const Token = {
  generateToken,
  verifyToken,
};
