import dotenv from "dotenv";

dotenv.config();

import * as z from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	PORT: z.coerce.number().min(1000, "PORT must be at least 1000"),
});

const env = envSchema.parse(process.env);

export const config = {
	DATABASE_URL: env.DATABASE_URL,
	PORT: env.PORT,
};

export default config;
