import * as z from "zod";

export const CreateCommentSchema = z.object({
	content: z.string().trim().min(1, "Comment is required").max(5000),
	userId: z.uuid({
		error: "userId must be a valid UUID",
	}),
	taskId: z.uuid({
		error: "taskId must be valid UUID",
	}),
});

export const GetTaskCommentsSchema = z.object({
	taskId: z.uuid({
		error: "taskId must be valid UUID",
	}),
});
