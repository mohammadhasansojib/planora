import express from "express";
import { validateRequest } from "../../middleware/zodValidation.js";
import { authController } from "./auth.controller.js";
import {
	LoginSchema,
	RefreshTokenSchema,
	RegisterSchema,
} from "./auth.schema.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

router.post(
	"/register",
	validateRequest(RegisterSchema),
	authController.register,
);
router.post("/login", validateRequest(LoginSchema), authController.login);
router.post("/logout", auth(), authController.logout);

router.post(
	"/refresh-token",
	validateRequest(RefreshTokenSchema),
	authController.refresh,
);

const authRouter = router;
export default authRouter;
