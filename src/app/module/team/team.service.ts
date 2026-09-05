import type { TeamRole } from "../../../generated/prisma/enums.js";
import { BadRequestError, NotFoundError } from "../../utils/errorFormats.js";
import teamRepo from "./team.repository.js";

const createTeam = async (name: string, organizationId: string) => {
	const organization = await teamRepo.getOrganizationById(organizationId);
	if (!organization) {
		throw new NotFoundError("Organization not found");
	}

	const existingTeam = await teamRepo.getTeamByNameAndOrganizationId(
		name,
		organizationId,
	);
	if (existingTeam) {
		throw new NotFoundError(
			"Team with this name already exists in the organization",
		);
	}

	const team = await teamRepo.createTeam(name, organizationId);
	return team;
};

const addMemberToTeam = async (
	teamId: string,
	userId: string,
	role: TeamRole,
) => {
	// check user existence and team existence logic can be added here
	// check if the user is already a member of the team logic can be added here

	const user = await teamRepo.getUserById(userId);
	if (!user) {
		throw new NotFoundError("User not found");
	}

	const team = await teamRepo.getTeamById(teamId);
	if (!team) {
		throw new NotFoundError("Team not found");
	}

	const existingMember = await teamRepo.checkMemberInTeam(teamId, userId);
	if (existingMember) {
		throw new BadRequestError("User is already a member of the team");
	}

	const newMember = await teamRepo.addMemberToTeam(teamId, userId, role);

	return newMember;
};

const teamService = {
	createTeam,
	addMemberToTeam,
};
export default teamService;
