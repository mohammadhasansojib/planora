import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config/index.js";
import { AuthorizationError } from "../utils/errorFormats.js";

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
			let token: string | null;

			if (req.headers.authorization) {
				if (req.headers.authorization.startsWith("Bearer")) {
					token = req.headers.authorization.split(" ")[1];
				} else {
					token = req.headers.authorization;
				}
			} else if (req.cookies.accessToken) {
				token = req.cookies.accessToken;
			} else {
				token = null;
			}

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
