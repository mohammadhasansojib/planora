import * as z from "zod";
import { TeamRole } from "../../../generated/prisma/enums.js";

export const TeamSchema = z.object({
	name: z.string().min(1, "Team name is required"),
	organizationId: z.uuid({
		error: "Invalid organization Id",
	}),
});

export const AddTeamMemberSchema = z.object({
	teamId: z.uuid({
		error: "Invalid team Id",
	}),
	userId: z.uuid({
		error: "Invalid user Id",
	}),
	role: z.enum([TeamRole.MEMBER, TeamRole.MANAGER], {
		error: "Role must be either 'MEMBER' or 'MANAGER'",
	}),
});

export const GetTeamMembersSchema = z.object({
	teamId: z.uuid({
		error: "Invalid team Id",
	}),
});

export const GetAllTeamsOptionsSchema = z.object({
	page: z.coerce
		.number()
		.int()
		.min(1, "number of page must be more that 0")
		.default(1),
	limit: z.coerce
		.number()
		.int()
		.min(1, "number of teams limit must be more that 0")
		.max(100, "number of teams limit cannot exceed 100")
		.default(10),
	organizationId: z.uuid({ error: "Invalid organization Id" }).optional(),
});
