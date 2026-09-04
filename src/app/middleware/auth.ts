import type { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../utils/errorFormats.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config/index.js";

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
			};
		}
	}
}

export const auth = () => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization
				? req.headers.authorization.startsWith("Bearer")
					? req.headers.authorization.split(" ")[1]
					: req.headers.authorization
				: null;
			if (!token) {
				throw new AuthorizationError("token not found");
			}

			const decoded = jwt.verify(
				token,
				config.ACCESS_TOKEN_SECRET,
			) as JwtPayload;
			if (!decoded) {
				throw new AuthorizationError("invalid token");
			}

			req.user = {
				id: decoded.id,
				email: decoded.email,
			};

			return next();
		} catch (error) {
			if (error instanceof Error && error.message) {
				const tokenError = new AuthorizationError(error.message);

				return next(tokenError);
			}

			return next(error);
		}
	};
};
