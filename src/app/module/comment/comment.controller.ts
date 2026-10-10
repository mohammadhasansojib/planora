import type { Request, Response } from "express";
import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync.js";
import { BadRequestError } from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import {
	CreateCommentSchema,
	GetTaskCommentsSchema,
} from "./comment.schema.js";
import commentService from "./comment.service.js";

const createComment = catchAsync(async (req: Request, res: Response) => {
	const { id: userId } = req.user as JwtPayload;

	const validData = CreateCommentSchema.safeParse({
		...req.body,
		userId,
	});
	if (!validData.success) {
		const errMessage = validData.error.issues
			.map((issue) => issue.message)
			.join(" | ");
		throw new BadRequestError(errMessage);
	}

	const comment = await commentService.createComment(validData.data, userId);

	sendResponse(res, {
		success: true,
		message: "Comment created successfully",
		statusCode: status.CREATED,
		data: {
			comment,
		},
	});
});

const getCommentsForTask = catchAsync(async (req: Request, res: Response) => {
	const { id: requestingUserId } = req.user as JwtPayload;
	const validData = GetTaskCommentsSchema.safeParse(req.query);
	if (!validData.success) {
		const errMessage = validData.error.issues
			.map((issue) => issue.message)
			.join(" | ");
		throw new BadRequestError(errMessage);
	}

	const comments = await commentService.getCommentsForTask(
		validData.data.taskId,
		requestingUserId,
	);

	sendResponse(res, {
		success: true,
		message: "Retrieved task comments successfully",
		statusCode: status.OK,
		data: {
			comments,
		},
	});
});

const commentController = {
	createComment,
	getCommentsForTask,
};
export default commentController;
