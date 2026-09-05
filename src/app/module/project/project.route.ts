import express from "express";
import { auth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/zodValidation.js";
import projectController from "./project.controller.js";
import { ProjectSchema } from "./project.schema.js";

const router = express.Router();

router.post(
	"/",
	auth(),
	validateRequest(ProjectSchema),
	projectController.createProject,
);

router.post("/:projectId/members", auth(), projectController.addMemberToProject);

const projectRouter = router;
export default projectRouter;