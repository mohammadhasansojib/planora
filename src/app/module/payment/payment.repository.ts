import { PaymentStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";


class PaymentRepository {
    async createPayment(payload: {
        userId: string,
        paymentId: string,
        transactionId: string,
        amount: number
    }) {
        const payment = await prisma.payment.create({
            data: {
                ...payload,
                status: PaymentStatus.COMPLETED,
            }
        });

        return payment;
    }
}


const paymentRepo = new PaymentRepository();
export default paymentRepo;