import { authRepo } from "./auth.repository.js";
import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import {
	AuthorizationError,
	ConflictError,
	NotFoundError,
} from "../../utils/errorFormats.js";
import type {
	UserLoginPayload,
	UserRegistrationPayload,
} from "./auth.interface.js";
import { config } from "../../config/index.js";
import type { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: UserRegistrationPayload) => {
	const { email, password } = payload;

	const user = await authRepo.getUserByEmail(email);
	if (user) {
		throw new ConflictError("user already exist with this email");
	}

	const hashPassword = await bcrypt.hash(
		password,
		Number(config.BCRYPT_SALT_ROUNDS),
	);

	const updatedPayload = {
		...payload,
		password: hashPassword,
	};

	const createdUser = await authRepo.createUserIntoDB(updatedPayload);

	return createdUser;
};

const loginUser = async (payload: UserLoginPayload) => {
	const { email, password } = payload;

	const user = await authRepo.getUserByEmail(email);
	if (!user) {
		throw new NotFoundError("user not found");
	}

	const isValidPass = await bcrypt.compare(password, user.password);
	if (!isValidPass) {
		throw new AuthorizationError("invalid password");
	}

	const tokenPayload = {
		id: user.id,
		email: user.email,
	};
	const accessToken = createAccessToken(tokenPayload);
    const refreshToken = createRefreshToken(tokenPayload);

	return {
		accessToken,
        refreshToken,
	};
};

const refreshToken = (refreshToken: string) => {
    const decoded = verifyRefreshToken(refreshToken) as JwtPayload;
    if (!decoded) {
        throw new AuthorizationError("invalid refresh token");
    }
 
    const tokenPayload = {
        id: decoded.id,
        email: decoded.email,
    };
    const newAccessToken = createAccessToken(tokenPayload);

    return newAccessToken;
}

export const authService = {
	createUser,
	loginUser,
    refreshToken,
};
