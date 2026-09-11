import type { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { BadRequestError } from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AssignTaskToSprintSchema, CreateSubtaskSchema } from "./task.schema.js";
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

// subtask
const createSubtask = catchAsync(async (req: Request, res: Response) => {
    const { taskId } = req.params;

    const validData = CreateSubtaskSchema.safeParse({
        taskId,
        ...req.body,
    });
    if (!validData.success) {
        const errMessage = validData.error.issues.map((issue) => issue.message).join(" | ");
        
        throw new BadRequestError(errMessage);
    }

    const subtask = await taskService.createSubtask({
        taskId,
        ...req.body,
    });

    sendResponse(res, {
        success: true,
        message: "Subtask created successfully",
        statusCode: status.CREATED,
        data: {
            subtask,
        }
    })
});

const addAttachment = catchAsync(async (req: Request, res: Response) => {
    
    const file = req.file;
    if (!file) {
        throw new BadRequestError("file not found");
    }

    const taskId = req.params.taskId;
    if (!(typeof taskId === "string") || !taskId) {
        throw new BadRequestError("invalid task id");
    }

    const userId = req.user?.id;
    if (!userId) {
        throw new BadRequestError("invalid user id");
    }

    // const attachment = await uploadToCloudinary(file.buffer);
    const attachment = await taskService.addAttachment(file, taskId, userId);

    sendResponse(res, {
        success: true,
        message: "attachment added successfully",
        statusCode: status.OK,
        data: {
            attachment,
        }
    })
});

const taskController = {
    createTask,
    assignTaskToSprint,
    createSubtask,
    addAttachment,
};
export default taskController;