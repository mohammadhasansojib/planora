import type { ProjectRole } from "../../../generated/prisma/enums.js";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../../utils/errorFormats.js";
import type { IGetAllProjectsOptions } from "./project.interface.js";
import projectRepo from "./project.repository.js";

const createProject = async (
	name: string,
	teamId: string,
	requestingUserId: string,
) => {
	const team = await projectRepo.getTeamById(teamId);

	if (!team) {
		throw new NotFoundError("Team not found");
	}

	const requestingMember = await projectRepo.getOrganizationMember(
		team.organizationId,
		requestingUserId,
	);
	if (!requestingMember) {
		throw new ForbiddenError("You are not a member of this organization");
	}

	const existingProject = await projectRepo.getProjectByNameAndTeamId(
		name,
		teamId,
	);

	if (existingProject) {
		throw new BadRequestError(
			"Project with this name already exists in the team",
		);
	}

	const project = await projectRepo.createProject(name, teamId);

	return project;
};

const addMemberToProject = async (
	projectId: string,
	userId: string,
	role: ProjectRole,
	requestingUserId: string,
) => {
	const user = await projectRepo.getUserById(userId);

	if (!user) {
		throw new NotFoundError("User not found");
	}

	const project = await projectRepo.getProjectById(projectId);

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	const team = await projectRepo.getTeamById(project.teamId);
	if (!team) {
		throw new NotFoundError("Project team not found");
	}

	const requestingMember = await projectRepo.getOrganizationMember(
		team.organizationId,
		requestingUserId,
	);
	if (!requestingMember) {
		throw new ForbiddenError("You are not a member of this organization");
	}

	const targetMember = await projectRepo.getOrganizationMember(
		team.organizationId,
		userId,
	);
	if (!targetMember) {
		throw new BadRequestError(
			"Project members must belong to the project's organization",
		);
	}

	const existingMember = await projectRepo.checkMemberInProject(
		projectId,
		userId,
	);

	if (existingMember) {
		throw new BadRequestError("User is already a member of the project");
	}

	const newMember = await projectRepo.addMemberToProject(
		projectId,
		userId,
		role,
	);

	return newMember;
};

const getProjectMembers = async (
	projectId: string,
	requestingUserId: string,
) => {
	const project = await projectRepo.getProjectById(projectId);
	if (!project) {
		throw new NotFoundError("Project not found");
	}

	const team = await projectRepo.getTeamById(project.teamId);
	if (!team) {
		throw new NotFoundError("Project team not found");
	}

	const requestingMember = await projectRepo.getOrganizationMember(
		team.organizationId,
		requestingUserId,
	);
	if (!requestingMember) {
		throw new ForbiddenError("You are not a member of this organization");
	}

	return projectRepo.getProjectMembers(projectId);
};

const getAllProjects = async (
	options: IGetAllProjectsOptions,
	requestingUserId: string,
) => {
	if (options.organizationId) {
		const organization = await projectRepo.getOrganizationById(
			options.organizationId,
		);
		if (!organization) {
			throw new NotFoundError("Organization not found");
		}

		const requestingMember = await projectRepo.getOrganizationMember(
			options.organizationId,
			requestingUserId,
		);
		if (!requestingMember) {
			throw new ForbiddenError("You are not a member of this organization");
		}
	}

	return projectRepo.getAllProjects(options);
};

const projectService = {
	createProject,
	addMemberToProject,
	getProjectMembers,
	getAllProjects,
};

export default projectService;
