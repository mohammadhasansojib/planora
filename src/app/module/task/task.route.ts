import express from "express";
import upload from "../../lib/multer.js";
import { auth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/zodValidation.js";
import taskController from "./task.controller.js";
import { CreateTaskSchema } from "./task.schema.js";

const router = express.Router();

router.post("/", auth(), validateRequest(CreateTaskSchema), taskController.createTask);
router.post("/:taskId/assign", auth(), taskController.assignTaskToSprint);

// subtask
router.post("/:taskId/subtasks", auth(), taskController.createSubtask);

// attachment
router.post("/:taskId/attachment", auth(), upload.single("attachment"), taskController.addAttachment);

const taskRouter = router;
export default taskRouter;