import { PaymentStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

type PaymentListOptions = {
	page: number;
	limit: number;
};

class PaymentRepository {
	async createPayment(payload: {
		userId: string;
		paymentId: string;
		amount: number;
	}) {
		return prisma.payment.create({
			data: {
				...payload,
				status: PaymentStatus.PENDING,
			},
		});
	}

	async getPayment(paymentId: string, userId: string) {
		return prisma.payment.findUnique({
			where: {
				paymentId,
				userId,
			},
			select: {
				status: true,
			},
		});
	}

	async updatePayment(payload: {
		userId: string;
		paymentId: string;
		status: PaymentStatus;
		transactionId?: string;
		amount?: number;
	}) {
		const { userId, paymentId, status, transactionId, amount } = payload;
		const result = await prisma.payment.updateMany({
			where: {
				paymentId,
				userId,
				status: PaymentStatus.PENDING,
			},
			data: {
				status,
				...(transactionId ? { transactionId } : {}),
				...(amount !== undefined ? { amount } : {}),
			},
		});

		if (result.count > 0) {
			return true;
		}

		const existing = await this.getPayment(paymentId, userId);
		return existing?.status === status;
	}

	async completePayment(payload: {
		userId: string;
		paymentId: string;
		transactionId: string;
		amount: number;
	}) {
		const result = await prisma.payment.updateMany({
			where: {
				paymentId: payload.paymentId,
				userId: payload.userId,
				status: {
					not: PaymentStatus.COMPLETED,
				},
			},
			data: {
				status: PaymentStatus.COMPLETED,
				transactionId: payload.transactionId,
				amount: payload.amount,
			},
		});

		if (result.count > 0) {
			return true;
		}

		const existing = await this.getPayment(payload.paymentId, payload.userId);
		return existing?.status === PaymentStatus.COMPLETED;
	}

	async getPayments(userId: string, options: PaymentListOptions) {
		const where = { userId };
		const [payments, total] = await Promise.all([
			prisma.payment.findMany({
				where,
				select: {
					id: true,
					paymentId: true,
					transactionId: true,
					amount: true,
					status: true,
					createdAt: true,
					updatedAt: true,
				},
				skip: (options.page - 1) * options.limit,
				take: options.limit,
				orderBy: {
					createdAt: "desc",
				},
			}),
			prisma.payment.count({ where }),
		]);

		return {
			payments,
			pagination: {
				page: options.page,
				limit: options.limit,
				total,
				totalPages: Math.ceil(total / options.limit),
			},
		};
	}
}

const paymentRepo = new PaymentRepository();
export default paymentRepo;
