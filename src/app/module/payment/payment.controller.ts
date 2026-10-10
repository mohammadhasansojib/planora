import type { Request, Response } from "express";
import status from "http-status";
import config from "../../config/index.js";
import { catchAsync } from "../../utils/catchAsync.js";
import {
	AuthorizationError,
	BadRequestError,
} from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { GetPaymentsOptionsSchema } from "./payment.schema.js";
import paymentService from "./payment.service.js";

const createPayment = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.id;
	if (!userId) {
		throw new AuthorizationError("user id not found");
	}

	const payment = await paymentService.createPayment(userId);

	sendResponse(res, {
		success: true,
		message: "Payment Created Successfully",
		statusCode: status.OK,
		data: {
			...payment,
			userId,
		},
	});
});

const getPayments = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.id;
	if (!userId) {
		throw new AuthorizationError("user id not found");
	}

	const options = GetPaymentsOptionsSchema.safeParse(req.query);
	if (!options.success) {
		throw new BadRequestError(
			options.error.issues.map((issue) => issue.message).join(" | "),
		);
	}

	const result = await paymentService.getPayments(userId, options.data);
	sendResponse(res, {
		success: true,
		message: "Payments retrieved successfully",
		statusCode: status.OK,
		data: result,
	});
});

const callbackPayment = catchAsync(async (req: Request, res: Response) => {
	const callbackStatus = req.query.status;
	if (typeof callbackStatus !== "string") {
		throw new BadRequestError("Invalid payment callback status");
	}

	const userId = req.query.userId;
	const paymentID = req.query.paymentID;
	if (typeof userId !== "string" || !userId) {
		throw new AuthorizationError("user id not found");
	}
	if (typeof paymentID !== "string" || !paymentID) {
		throw new BadRequestError("paymentID not found");
	}
	const payment = await paymentService.getPayment(paymentID, userId);
	if (!payment) {
		throw new BadRequestError("Payment attempt not found");
	}

	let frontendStatus: "success" | "failure" | "cancelled";
	if (callbackStatus === "success") {
		const paymentCompleted = await paymentService.executePayment(
			paymentID,
			userId,
		);
		frontendStatus = paymentCompleted ? "success" : "failure";
		if (!paymentCompleted) {
			const updated = await paymentService.updatePaymentStatus(
				paymentID,
				userId,
				"FAILED",
			);
			if (!updated && payment.status === "PENDING") {
				throw new BadRequestError("Payment attempt could not be updated");
			}
		}
	} else if (callbackStatus === "failure") {
		const updated = await paymentService.updatePaymentStatus(
			paymentID,
			userId,
			"FAILED",
		);
		if (!updated) {
			throw new BadRequestError("Payment attempt could not be updated");
		}
		frontendStatus = "failure";
	} else if (callbackStatus === "cancel" || callbackStatus === "cancelled") {
		const updated = await paymentService.updatePaymentStatus(
			paymentID,
			userId,
			"CANCELLED",
		);
		if (!updated) {
			throw new BadRequestError("Payment attempt could not be updated");
		}
		frontendStatus = "cancelled";
	} else {
		throw new BadRequestError("Unsupported payment callback status");
	}

	const redirectURL = new URL(config.BKASH_FRONTEND_REDIRECT_URL);
	redirectURL.searchParams.set("status", frontendStatus);
	res.redirect(redirectURL.toString());
});

const paymentController = {
	createPayment,
	getPayments,
	callbackPayment,
};
export default paymentController;
