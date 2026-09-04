import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { authService } from "./auth.service.js";
import status from "http-status";

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

	const loginData = await authService.loginUser(payload);

	sendResponse(res, {
		success: true,
		message: "login successful",
		statusCode: status.OK,
		data: loginData,
	});
});

const logout = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;

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
    const {refreshToken} = req.body;

    const newAccessToken = authService.refreshToken(refreshToken);

    sendResponse(res, {
        success: true,
        message: "token refreshed sucessfully",
        statusCode: status.OK,
        data: {
            newAccessToken,
        }
    })
});

export const authController = {
	register,
	login,
	logout,
    refresh,
};
