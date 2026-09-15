import * as z from "zod";


export const CreateTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    projectId: z.uuid({
        error: "Project ID must be a valid UUID",
    }),
    sprintId: z.uuid({
        error: "Sprint ID must be a valid UUID",
    }).optional(),
});

export const AssignTaskToSprintSchema = z.object({
    taskId: z.uuid({
        error: "Task ID must be a valid UUID",
    }),
    sprintId: z.uuid({
        error: "Sprint ID must be a valid UUID",
    }),
});

export const CreateSubtaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    taskId: z.uuid({
        error: "Invalid taskId"
    }),
});


export const GetAllTasksOptionsSchema = z.object({
    page: z.coerce.number().min(1, "number of page must be more that 0").optional(),
    limit: z.coerce.number().min(1, "number of project limit must be more that 0").optional(),
    sortBy: z.enum(["createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    term: z.string().optional(),
});