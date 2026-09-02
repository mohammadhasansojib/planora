import type { NextFunction, Request, Response } from "express";
import type * as z from "zod";
import { BadRequestError } from "../utils/errorFormats.js";

export const validateRequest =
	(schema: z.ZodType) => (req: Request, _res: Response, next: NextFunction) => {
		try {
			const payload = req.body ?? {};

			const result = schema.safeParse(payload);
			if (!result.success) {
				throw new BadRequestError(result.error.issues[0].message);
			}
			req.body = result.data;

			next();
		} catch (error) {
			next(error);
		}
	};
