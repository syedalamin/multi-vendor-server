import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { AuthServices } from "./auth.services";

const login = catchAsync(async (req, res) => {
  const result = await AuthServices.login(req.body);

  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
    sameSite: "none", 
  });

  sendResponse(res, {
    statusCode: status.OK,
    message: "User Login Successfully",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});


const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Refresh Token is Successfully",
    data: result,
  });
});


const changePassword = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await AuthServices.changePassword(user, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Password Change Successfully",
    data: result,
  });
});


const forgetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgetPassword(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Forget Password Send Successfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  // const token = req.headers.authorization || "";
  const result = await AuthServices.resetPassword(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Forget Password Send Successfully",
    data: result,
  });
});

export const AuthControllers = {
  login,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
