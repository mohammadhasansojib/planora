import * as z from "zod";

export const PaymentExecuteSchema = z.object({
	trxID: z.string(),
	paymentID: z.string(),
	amount: z.coerce.number(),
});

export const GetPaymentsOptionsSchema = z.object({
	page: z.coerce
		.number()
		.int()
		.min(1, "number of page must be more that 0")
		.default(1),
	limit: z.coerce
		.number()
		.int()
		.min(1, "number of payment limit must be more that 0")
		.max(100, "number of payment limit cannot exceed 100")
		.default(10),
});
