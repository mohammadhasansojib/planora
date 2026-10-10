import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../../utils/errorFormats.js";
import type { ICreateSprint } from "./sprint.interface.js";
import sprintRepo from "./sprint.repository.js";

const createSprint = async (
	{ name, projectId, startTime, endTime }: ICreateSprint,
	requestingUserId: string,
) => {
	const project = await sprintRepo.getProjectById(projectId);
	if (!project) {
		throw new NotFoundError("Project not found");
	}

	const team = await sprintRepo.getTeamById(project.teamId);
	if (!team) {
		throw new NotFoundError("Project team not found");
	}

	const organizationMember = await sprintRepo.getOrganizationMember(
		team.organizationId,
		requestingUserId,
	);
	if (!organizationMember) {
		throw new ForbiddenError("You are not a member of this organization");
	}

	const existingSprint = await sprintRepo.getSprintByNameAndProjectId(
		name,
		projectId,
	);
	if (existingSprint) {
		throw new BadRequestError(
			"Sprint with this name already exists for the project",
		);
	}

	const sprint = await sprintRepo.createSprint({
		name,
		projectId,
		startTime,
		endTime,
	});

	return sprint;
};

const sprintService = {
	createSprint,
};
export default sprintService;
