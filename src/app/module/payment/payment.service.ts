import config from "../../config/index.js";
import getBkashIdToken from "../../lib/bkash.js";
import { AuthorizationError } from "../../utils/errorFormats.js";
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
				// agreementID:'TokenizedMerchant01L3IKB6H1565072174986',
				mode: "0011",
				payerReference: "01929918378",
				callbackURL: `${config.BKASH_CALLBACK_URL}/api/v1/payments/callback?userId=${userId}`,
				// merchantAssociationInfo: "MI05MID54RF09123456One",
				amount: "600",
				currency: "BDT",
				intent: "sale",
				merchantInvoiceNumber: "Inv04324",
			}),
		},
	);

	const bkashCreatePaymentResult = await bkashCreatePayment.json();

	return bkashCreatePaymentResult;
};

const executePayment = async (paymentID: string, userId: string) => {
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

	await paymentRepo.createPayment({
		userId,
		transactionId: result.trxID,
		paymentId: paymentID,
		amount,
	});

	return true;
};

const paymentService = {
	createPayment,
	executePayment,
};
export default paymentService;
