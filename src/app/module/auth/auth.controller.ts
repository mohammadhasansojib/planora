import type { Request, Response } from "express";
import status from "http-status";
import { accessTokenCookieConfig, refreshTokenCookieConfig } from "../../config/cookie.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AuthorizationError } from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { authService } from "./auth.service.js";


const register = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const createdUser = await authService.createUser(payload);

	sendResponse(res, {
		success: true,
		message: "Registration successful",
		statusCode: status.CREATED,
		data: {
			user: createdUser,
		},
	});
});

const login = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const { accessToken, refreshToken } = await authService.loginUser(payload);

	res.cookie("accessToken", accessToken, {
		...accessTokenCookieConfig,
	});
	res.cookie("refreshToken", refreshToken, {
		...refreshTokenCookieConfig,
	});

	sendResponse(res, {
		success: true,
		message: "login successful",
		statusCode: status.OK,
		data: {
			accessToken,
			refreshToken,
		},
	});
});

const logout = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;
	if (!user) {
		throw new AuthorizationError("user not authorized");
	}

	res.clearCookie("accessToken", {
		...accessTokenCookieConfig,
	});
	res.clearCookie("refreshToken", {
		...refreshTokenCookieConfig,
	});

	sendResponse(res, {
		success: true,
		message: "user logout successfully",
		statusCode: status.OK,
		data: {
			user,
		},
	});
});

const refresh = catchAsync(async (req: Request, res: Response) => {
	const refreshToken = req.cookies?.refreshToken;
	if (!refreshToken) {
		throw new AuthorizationError("refresh token not found");
	}

	const newAccessToken = authService.refreshToken(refreshToken);
	res.cookie("accessToken", newAccessToken, {
		...accessTokenCookieConfig,
	});

	sendResponse(res, {
		success: true,
		message: "token refreshed sucessfully",
		statusCode: status.OK,
		data: {
			newAccessToken,
		},
	});
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await authService.googleLogin(payload);
	const { accessToken, refreshToken } = result;

	res.cookie("accessToken", accessToken, {
		...accessTokenCookieConfig,
	});
	res.cookie("refreshToken", refreshToken, {
		...refreshTokenCookieConfig,
	});

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: "New tokens generated successfully",
		data: {
			accessToken,
			refreshToken,
		},
	});
});

export const authController = {
	register,
	login,
	logout,
	refresh,
	googleLogin,
};
