import * as z from "zod";


export const CreateCommentSchema = z.object({
    content: z.string().min(1, "content is required"),
    userId: z.uuid({
        error: "userId must be a valid UUID",
    }),
    taskId: z.uuid({
        error: "taskId must be valid UUID",
    }),
});