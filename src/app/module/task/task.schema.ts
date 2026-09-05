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