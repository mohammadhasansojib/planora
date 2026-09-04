import dotenv from "dotenv";

dotenv.config();

import * as z from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	PORT: z.coerce.number().min(1000, "PORT must be at least 1000"),
	BCRYPT_SALT_ROUNDS: z.coerce
		.number()
		.min(8, "BCRYPT_SALT_ROUNDS is required"),
	ACCESS_TOKEN_SECRET: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
	ACCESS_TOKEN_EXPIRE: z.coerce
		.number()
		.min(1, "ACCESS_TOKEN_EXPIRE is required"),
	REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
	REFRESH_TOKEN_EXPIRE: z.coerce
		.number()
		.min(1, "REFRESH_TOKEN_EXPIRE is required"),
});

const env = envSchema.parse(process.env);

export const config = {
	DATABASE_URL: env.DATABASE_URL,
	PORT: env.PORT,
	BCRYPT_SALT_ROUNDS: env.BCRYPT_SALT_ROUNDS,
	ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRE: env.ACCESS_TOKEN_EXPIRE,
	REFRESH_TOKEN_SECRET: env.REFRESH_TOKEN_SECRET,
	REFRESH_TOKEN_EXPIRE: env.REFRESH_TOKEN_EXPIRE,
};

export default config;
