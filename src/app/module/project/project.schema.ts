import * as z from "zod";
import { ProjectRole } from "../../../generated/prisma/enums.js";

export const ProjectSchema = z.object({
	name: z.string().min(1, "Project name is required"),
	teamId: z.uuid({
		error: "Invalid team Id",
	}),
});

export const AddProjectMemberSchema = z.object({
	projectId: z.uuid({
		error: "Invalid project Id",
	}),
	userId: z.uuid({
		error: "Invalid user Id",
	}),
	role: z.enum([ProjectRole.MEMBER, ProjectRole.MANAGER], {
		error: "Role must be either 'MEMBER' or 'MANAGER'",
	}),
});

export const GetProjectMembersSchema = z.object({
	projectId: z.uuid({
		error: "Invalid project Id",
	}),
});

export const GetAllProjectsOptionsSchema = z.object({
	page: z.coerce
		.number()
		.int()
		.min(1, "number of page must be more that 0")
		.default(1),
	limit: z.coerce
		.number()
		.int()
		.min(1, "number of project limit must be more that 0")
		.max(100, "number of project limit cannot exceed 100")
		.default(10),
	organizationId: z.uuid({ error: "Invalid organization Id" }).optional(),
});
