import type { TeamRole } from "../../../generated/prisma/enums.js";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../../utils/errorFormats.js";
import type { IGetAllTeamOptions } from "./team.interface.js";
import teamRepo from "./team.repository.js";

const createTeam = async (
	name: string,
	organizationId: string,
	requestingUserId: string,
) => {
	const organization = await teamRepo.getOrganizationById(organizationId);
	if (!organization) {
		throw new NotFoundError("Organization not found");
	}

	const organizationMember = await teamRepo.getOrganizationMember(
		organizationId,
		requestingUserId,
	);
	if (!organizationMember) {
		throw new ForbiddenError("You are not a member of this organization");
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
	requestingUserId: string,
) => {
	const user = await teamRepo.getUserById(userId);
	if (!user) {
		throw new NotFoundError("User not found");
	}

	const team = await teamRepo.getTeamById(teamId);
	if (!team) {
		throw new NotFoundError("Team not found");
	}

	const requestingMember = await teamRepo.getOrganizationMember(
		team.organizationId,
		requestingUserId,
	);
	if (!requestingMember) {
		throw new ForbiddenError("You are not a member of this organization");
	}

	const organizationMember = await teamRepo.getOrganizationMember(
		team.organizationId,
		userId,
	);
	if (!organizationMember) {
		throw new BadRequestError(
			"Team members must belong to the team's organization",
		);
	}

	const existingMember = await teamRepo.checkMemberInTeam(teamId, userId);
	if (existingMember) {
		throw new BadRequestError("User is already a member of the team");
	}

	const newMember = await teamRepo.addMemberToTeam(teamId, userId, role);

	return newMember;
};

const getTeamMembers = async (teamId: string, requestingUserId: string) => {
	const team = await teamRepo.getTeamById(teamId);
	if (!team) {
		throw new NotFoundError("Team not found");
	}

	const requestingMember = await teamRepo.getOrganizationMember(
		team.organizationId,
		requestingUserId,
	);
	if (!requestingMember) {
		throw new ForbiddenError("You are not a member of this organization");
	}

	return teamRepo.getTeamMembers(teamId);
};

const getAllTeams = async (
	options: IGetAllTeamOptions,
	requestingUserId: string,
) => {
	if (options.organizationId) {
		const organization = await teamRepo.getOrganizationById(
			options.organizationId,
		);
		if (!organization) {
			throw new NotFoundError("Organization not found");
		}

		const organizationMember = await teamRepo.getOrganizationMember(
			options.organizationId,
			requestingUserId,
		);
		if (!organizationMember) {
			throw new ForbiddenError("You are not a member of this organization");
		}
	}

	return teamRepo.getAllTeams(options);
};

const teamService = {
	createTeam,
	addMemberToTeam,
	getTeamMembers,
	getAllTeams,
};
export default teamService;
