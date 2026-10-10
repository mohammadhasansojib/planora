import * as z from "zod";

export const CreateTaskSchema = z.object({
	title: z.string().trim().min(1, "Title is required"),
	description: z.string().trim().optional(),
	projectId: z.uuid({
		error: "Project ID must be a valid UUID",
	}),
	sprintId: z
		.uuid({
			error: "Sprint ID must be a valid UUID",
		})
		.optional(),
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
	title: z.string().trim().min(1, "Title is required").max(200),
	description: z.string().trim().max(2000).optional(),
	taskId: z.uuid({
		error: "Invalid taskId",
	}),
});

export const GetAllTasksOptionsSchema = z.object({
	page: z.coerce
		.number()
		.int()
		.min(1, "Page must be greater than 0")
		.default(1),
	limit: z.coerce
		.number()
		.int()
		.min(1, "Limit must be greater than 0")
		.max(100)
		.default(10),
	organizationId: z.uuid({ error: "Invalid organization ID" }),
	sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
	order: z.enum(["asc", "desc"]).default("desc"),
	term: z.string().trim().max(200).optional(),
});
