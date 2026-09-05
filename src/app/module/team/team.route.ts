import express from "express";
import { auth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/zodValidation.js";
import teamController from "./team.controller.js";
import { TeamSchema } from "./team.schema.js";

const router = express.Router();

router.post(
	"/",
	auth(),
	validateRequest(TeamSchema),
	teamController.createTeam,
);
router.post("/:teamId/members", auth(), teamController.addMemberToTeam);

const teamRouter = router;
export default teamRouter;
