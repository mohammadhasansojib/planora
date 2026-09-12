import config from "../../config/index.js";
import getBkashIdToken from "../../lib/bkash.js";
import { AuthorizationError, BadRequestError } from "../../utils/errorFormats.js";
import paymentRepo from "./payment.repository.js";


const createPayment = async (userId: string) => {
    const idToken = await getBkashIdToken();

    const bkashCreatePayment = await fetch(`${config.BKASH_BASE_URL}/tokenized/checkout/create`, {
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
        })
    });

    const bkashCreatePaymentResult = await bkashCreatePayment.json();

    return bkashCreatePaymentResult;
}

const executePayment = async (query: Record<string, any>, userId: string) => {

    const idToken = await getBkashIdToken();
    if (!idToken) {
        throw new AuthorizationError("idToken not found");
    }

    const paymentID = query.paymentID;
    if (!paymentID) {
        throw new BadRequestError("paymentID not found");
    }

    const status = query.status;
    if (!status) {
        throw new BadRequestError("status not found");
    }

    const execute = await fetch(`${config.BKASH_BASE_URL}/tokenized/checkout/execute`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: idToken,
            "X-App-Key": config.BKASH_APP_KEY,
        },
        body: JSON.stringify({
            paymentID: query.paymentID,
        })
    });

    const result = await execute.json();

    if (status === "success" && result.trxID && result.paymentID && result.amount) {
        await paymentRepo.createPayment({
            userId,
            transactionId: result.trxID,
            paymentId: result.paymentID,
            amount: result.amount,
        });
    }

    return result;
}

const paymentService = {
    createPayment,
    executePayment,
}
export default paymentService;