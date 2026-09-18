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
	const { refreshToken } = req.body;

	const newAccessToken = authService.refreshToken(refreshToken);

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
    const { accessToken, refreshToken } = result

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 // 24 hour or 1 day
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    })

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'New tokens generated successfully',
        data: {
            accessToken,
            refreshToken,
        },
    });
})

export const authController = {
	register,
	login,
	logout,
	refresh,
	googleLogin,
};
