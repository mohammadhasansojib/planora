import type {Request, Response} from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import sprintService from "./sprint.service.js";


const createSprint = catchAsync(async (req: Request, res: Response) => {
    const { name, projectId, startTime, endTime } = req.body;

    const sprint = await sprintService.createSprint({
        name,
        projectId,
        startTime,
        endTime
    });

    sendResponse(res, {
        success: true,
        message: "Sprint created successfully",
        statusCode: status.CREATED,
        data: {
            sprint,
        },
    });
});

const sprintController = {
  createSprint,
};
export default sprintController;