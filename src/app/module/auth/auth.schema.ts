import * as z from "zod";

export const RegisterSchema = z.object({
	username: z
		.string()
		.min(3, "username must be atleast 3 characters")
		.max(30, "username can be atmost 30 characters"),
	email: z.email().min(1, "must be a valid email"),
	password: z
		.string()
		.min(8, "password must be atleast 8 characters")
		.max(30, "password can be atmost 30 characters"),
});

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(8, "password must be minimum 8 characters"),
});

export const RefreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "refresh token is required"),
})