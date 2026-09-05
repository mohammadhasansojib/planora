import type { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { BadRequestError } from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { CreateCommentSchema } from "./comment.schema.js";
import commentService from "./comment.service.js";


const createComment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const validData = CreateCommentSchema.safeParse({
        userId,
        ...req.body,
    });
    if (!validData.success) {
        const errMessage = validData.error.issues.map(issue => issue.message).join(" | ");
        throw new BadRequestError(errMessage);
    }

    const comment = await commentService.createComment(validData.data);

    sendResponse(res, {
        success: true,
        message: "Comment created successfully",
        statusCode: status.CREATED,
        data: {
            comment,
        }
    })

})


const commentController = {
    createComment,
}
export default commentController;