import * as z from "zod";

export const PaymentExecuteSchema = z.object({
    trxID: z.string(),
    paymentID: z.string(),
    amount: z.coerce.number(),
})