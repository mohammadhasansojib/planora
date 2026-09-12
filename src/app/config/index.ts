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
	CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
	CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
	CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
	BKASH_BASE_URL: z.string().min(1, "BKASH_BASE_URL is required"),
	BKASH_USERNAME: z.string().min(1, "BKASH_USERNAME is required"),
	BKASH_PASSWORD: z.string().min(1, "BKASH_PASSWORD is required"),
	BKASH_APP_KEY: z.string().min(1, "BKASH_APP_KEY is required"),
	BKASH_APP_SECRET: z.string().min(1, "BKASH_APP_SECRET is required"),
	BKASH_CALLBACK_URL: z.string().min(1, "BKASH_CALLBACK_URL is required"),
	BKASH_FRONTEND_REDIRECT_URL: z.string().min(1, "BKASH_FRONTEND_REDIRECT_URL is required"),
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
	CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET,
	BKASH_BASE_URL: env.BKASH_BASE_URL,
	BKASH_USERNAME: env.BKASH_USERNAME,
	BKASH_PASSWORD: env.BKASH_PASSWORD,
	BKASH_APP_KEY: env.BKASH_APP_KEY,
	BKASH_APP_SECRET: env.BKASH_APP_SECRET,
	BKASH_CALLBACK_URL: env.BKASH_CALLBACK_URL,
	BKASH_FRONTEND_REDIRECT_URL: env.BKASH_FRONTEND_REDIRECT_URL,
};

export default config;
