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