import express from "express";
import { auth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/zodValidation.js";
import taskController from "./task.controller.js";
import { CreateTaskSchema } from "./task.schema.js";

const router = express.Router();

router.post("/", auth(), validateRequest(CreateTaskSchema), taskController.createTask);
router.post("/:taskId/assign", auth(), taskController.assignTaskToSprint);

const taskRouter = router;
export default taskRouter;