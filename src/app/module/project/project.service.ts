import type { ProjectRole } from "../../../generated/prisma/enums.js";
import { BadRequestError, NotFoundError } from "../../utils/errorFormats.js";
import projectRepo from "./project.repository.js";

const createProject = async (name: string, teamId: string) => {
	const team = await projectRepo.getTeamById(teamId);

	if (!team) {
		throw new NotFoundError("Team not found");
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
) => {
	const user = await projectRepo.getUserById(userId);

	if (!user) {
		throw new NotFoundError("User not found");
	}

	const project = await projectRepo.getProjectById(projectId);

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	const existingMember = await projectRepo.checkMemberInProject(
		projectId,
		userId,
	);

	if (existingMember) {
		throw new BadRequestError(
			"User is already a member of the project",
		);
	}

	const newMember = await projectRepo.addMemberToProject(
		projectId,
		userId,
		role,
	);

	return newMember;
};

const projectService = {
	createProject,
	addMemberToProject,
};

export default projectService;