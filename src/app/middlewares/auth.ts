import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/share/apiError";
import status from "http-status";
import { Token } from "../../utils/authToken/generateToken";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import prisma from "../../utils/share/prisma";
import { UserStatus } from "@prisma/client";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(status.UNAUTHORIZED, "You are not authorized");
      }
      const verifiedUser = Token.verifyToken(
        token,
        config.jwt.access_Token as Secret
      );
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(status.FORBIDDEN, "Forbidden");
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
      req.user = verifiedUser;

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
