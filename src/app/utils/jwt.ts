import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { AuthorizationError } from "./errorFormats.js";

interface IAccessTokenPayload {
	id: string;
	email: string;
}

export const createAccessToken = (tokenPayload: IAccessTokenPayload) => {
	const accessToken = jwt.sign(tokenPayload, config.ACCESS_TOKEN_SECRET, {
		expiresIn: config.ACCESS_TOKEN_EXPIRE,
	});

	return accessToken;
};

export const createRefreshToken = (tokenPayload: IAccessTokenPayload) => {
	const refreshToken = jwt.sign(tokenPayload, config.REFRESH_TOKEN_SECRET, {
		expiresIn: config.REFRESH_TOKEN_EXPIRE,
	});

	return refreshToken;
};

export const verifyRefreshToken = (token: string) => {
	try {
		const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET);

		return decoded;
	} catch (error) {
		console.log(error);

		if (error instanceof Error && error.message) {
			throw new AuthorizationError(error.message);
		}

		throw error;
	}
};
