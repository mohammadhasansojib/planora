import { authRepo } from "./auth.repository.js";
import bcrypt from "bcryptjs";
import {
	createAccessToken,
	createRefreshToken,
	verifyRefreshToken,
} from "../../utils/jwt.js";
import {
	AuthorizationError,
	BadRequestError,
	ConflictError,
	NotFoundError,
} from "../../utils/errorFormats.js";
import type {
	IGoogleLoginPayload,
	UserLoginPayload,
	UserRegistrationPayload,
} from "./auth.interface.js";
import { config } from "../../config/index.js";
import type { JwtPayload } from "jsonwebtoken";
import { googleClient } from "../../lib/google.js";
import { TokenPayload } from "google-auth-library";


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
	if (!user.password) {
		throw new BadRequestError("password not found");
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
};

const googleLogin = async (payload: IGoogleLoginPayload) => {
	
	let googleIdTokenPayload: TokenPayload | null | undefined = null;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: payload.idToken,
            audience: config.GOOGLE_CLIENT_ID,
        });

        googleIdTokenPayload = ticket.getPayload();
    } catch (error) {
        console.log("Google token verification failed", error);
        throw new Error("Google token verification failed");
    }

    if (!googleIdTokenPayload) {
        throw new Error("Invalid or expired google id token");
    }
    if (!googleIdTokenPayload.name) {
        throw new Error("User name not found from google");
    }
    if (!googleIdTokenPayload.email) {
        throw new Error("User email not found from google");
    }

    const isUserExist = await authRepo.getUserByEmail(googleIdTokenPayload.email);

    let user = isUserExist;

    if (!user) {
        user = await authRepo.createUserUsingGoogle({
			username: googleIdTokenPayload.name,
			email: googleIdTokenPayload.email,
		})
    }

    const jwtPayload = {
        id: user.id,
        email: user.email,
    }
    const accessToken = createAccessToken(jwtPayload);
    const refreshToken = createRefreshToken(jwtPayload);

    return {
        accessToken,
        refreshToken
    }
}

export const authService = {
	createUser,
	loginUser,
	refreshToken,
	googleLogin,
};
