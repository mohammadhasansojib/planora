import config from "./index.js";

export const cookieConfig: {
	httpOnly: boolean,
	secure: boolean,
	sameSite: boolean | "none" | "lax" | "strict",
} = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};
export const accessTokenCookieConfig = {
	...cookieConfig,
	maxAge: config.ACCESS_TOKEN_EXPIRE * 1000,
};
export const refreshTokenCookieConfig = {
	...cookieConfig,
	maxAge: config.REFRESH_TOKEN_EXPIRE * 1000,
};