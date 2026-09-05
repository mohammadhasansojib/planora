import type { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { BadRequestError } from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AssignTaskToSprintSchema } from "./task.schema.js";
import taskService from "./task.service.js";


const createTask = catchAsync(async (req: Request, res: Response) => {

    const task = await taskService.createTask(req.body);

    sendResponse(res, {
        success: true,
        message: "Task created successfully",
        statusCode: status.CREATED,
        data: {
            task,
        },
    });
});

const assignTaskToSprint = catchAsync(async (req: Request, res: Response) => {
    const taskId = req.params.taskId;
    const { sprintId } = req.body;

    const validData = AssignTaskToSprintSchema.safeParse({
        taskId,
        sprintId,
    });
    if (!validData.success) {
        const errMessage = validData.error.issues.map((issue) => issue.message).join(" | ");
        throw new BadRequestError(errMessage);
    }

    const task = await taskService.assignTaskToSprint(validData.data.taskId, validData.data.sprintId);

    sendResponse(res, {
        success: true,
        message: "Task assigned successfully",
        statusCode: status.CREATED,
        data: {
            task,
        },
    });
});

const taskController = {
    createTask,
    assignTaskToSprint,
};
export default taskController;