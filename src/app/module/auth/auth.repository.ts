import { prisma } from "../../lib/prisma.js";
import type { UserRegistrationPayload } from "./auth.interface.js";

class AuthRepo {
	async createUserIntoDB(payload: UserRegistrationPayload) {
		const createdUser = await prisma.user.create({
			data: {
				...payload,
			},
			omit: {
				password: true,
			},
		});

		return createdUser;
	}

	async getUserByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		return user;
	}
}

export const authRepo = new AuthRepo();
