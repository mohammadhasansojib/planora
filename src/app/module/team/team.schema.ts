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

export const GetAllTeamsOptionsSchema = z.object({
	page: z.coerce.number().min(1, "number of page must be more that 0").optional(),
	limit: z.coerce.number().min(1, "number of teams limit must be more that 0").optional(),
});
