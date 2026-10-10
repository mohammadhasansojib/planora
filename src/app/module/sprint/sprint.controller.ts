import type { Request, Response } from "express";
import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import sprintService from "./sprint.service.js";

const createSprint = catchAsync(async (req: Request, res: Response) => {
	const { id: requestingUserId } = req.user as JwtPayload;
	const sprint = await sprintService.createSprint(req.body, requestingUserId);

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
