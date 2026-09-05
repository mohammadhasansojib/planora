import express from "express";
import { auth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/zodValidation.js";
import sprintController from "./sprint.controller.js";
import { CreateSprintSchema } from "./sprint.schema.js";

const router = express.Router();

router.post("/", auth(), validateRequest(CreateSprintSchema), sprintController.createSprint);

const sprintRouter = router;
export default sprintRouter;