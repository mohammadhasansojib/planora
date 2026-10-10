import config from "../../config/index.js";
import getBkashIdToken from "../../lib/bkash.js";
import { AppError, AuthorizationError } from "../../utils/errorFormats.js";
import paymentRepo from "./payment.repository.js";

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

const createPayment = async (userId: string) => {
	const idToken = await getBkashIdToken();

	const bkashCreatePayment = await fetch(
		`${config.BKASH_BASE_URL}/tokenized/checkout/create`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: idToken,
				"X-App-Key": config.BKASH_APP_KEY,
			},
			body: JSON.stringify({
				mode: "0011",
				payerReference: "01929918378",
				callbackURL: `${config.BKASH_CALLBACK_URL}/api/v1/payments/callback?userId=${userId}`,
				amount: "600",
				currency: "BDT",
				intent: "sale",
				merchantInvoiceNumber: "Inv04324",
			}),
		},
	);

	if (!bkashCreatePayment.ok) {
		throw new AppError("bKash could not initialize the payment", 502);
	}

	const bkashCreatePaymentResult: unknown = await bkashCreatePayment.json();
	if (
		!isRecord(bkashCreatePaymentResult) ||
		typeof bkashCreatePaymentResult.paymentID !== "string" ||
		!bkashCreatePaymentResult.paymentID ||
		typeof bkashCreatePaymentResult.bkashURL !== "string" ||
		!bkashCreatePaymentResult.bkashURL
	) {
		throw new AppError("bKash returned incomplete payment information", 502);
	}

	await paymentRepo.createPayment({
		userId,
		paymentId: bkashCreatePaymentResult.paymentID,
		amount: 600,
	});

	return bkashCreatePaymentResult;
};

const executePayment = async (paymentID: string, userId: string) => {
	const existingPayment = await paymentRepo.getPayment(paymentID, userId);
	if (existingPayment?.status === "COMPLETED") {
		return true;
	}
	if (!existingPayment) {
		return false;
	}

	const idToken = await getBkashIdToken();
	if (!idToken) {
		throw new AuthorizationError("idToken not found");
	}

	const execute = await fetch(
		`${config.BKASH_BASE_URL}/tokenized/checkout/execute`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: idToken,
				"X-App-Key": config.BKASH_APP_KEY,
			},
			body: JSON.stringify({
				paymentID,
			}),
		},
	);

	if (!execute.ok) {
		return false;
	}

	const result: unknown = await execute.json();
	if (
		!isRecord(result) ||
		result.paymentID !== paymentID ||
		typeof result.trxID !== "string" ||
		!result.trxID ||
		(typeof result.amount !== "string" && typeof result.amount !== "number")
	) {
		return false;
	}

	const amount = Number(result.amount);
	if (!Number.isFinite(amount) || amount <= 0) {
		return false;
	}

	return paymentRepo.completePayment({
		userId,
		paymentId: paymentID,
		transactionId: result.trxID,
		amount,
	});
};

const updatePaymentStatus = async (
	paymentID: string,
	userId: string,
	paymentStatus: "FAILED" | "CANCELLED",
) => {
	return paymentRepo.updatePayment({
		userId,
		paymentId: paymentID,
		status: paymentStatus,
	});
};

const getPayment = async (paymentID: string, userId: string) =>
	paymentRepo.getPayment(paymentID, userId);

const getPayments = async (
	userId: string,
	options: { page: number; limit: number },
) => paymentRepo.getPayments(userId, options);

const paymentService = {
	createPayment,
	executePayment,
	updatePaymentStatus,
	getPayment,
	getPayments,
};
export default paymentService;
