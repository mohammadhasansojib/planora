import { ForbiddenError, NotFoundError } from "../../utils/errorFormats.js";
import type { ICreateComment } from "./comment.interface.js";
import commentRepo from "./comment.repository.js";

const ensureTaskAccess = async (taskId: string, userId: string) => {
	const task = await commentRepo.getTaskById(taskId);
	if (!task) {
		throw new NotFoundError("Task not found");
	}

	const project = await commentRepo.getProjectById(task.projectId);
	if (!project) {
		throw new NotFoundError("Project not found");
	}

	const team = await commentRepo.getTeamById(project.teamId);
	if (!team) {
		throw new NotFoundError("Project team not found");
	}

	const organizationMember = await commentRepo.getOrganizationMember(
		team.organizationId,
		userId,
	);
	if (!organizationMember) {
		throw new ForbiddenError("You are not a member of this organization");
	}
};

const createComment = async (
	payload: ICreateComment,
	requestingUserId: string,
) => {
	// check if the user exists
	const user = await commentRepo.getUserById(payload.userId);
	if (!user) {
		throw new NotFoundError("User not found");
	}

	await ensureTaskAccess(payload.taskId, requestingUserId);

	return commentRepo.createComment(payload);
};

const getCommentsForTask = async (taskId: string, requestingUserId: string) => {
	await ensureTaskAccess(taskId, requestingUserId);
	return commentRepo.getCommentsByTaskId(taskId);
};

const commentService = {
	createComment,
	getCommentsForTask,
};
export default commentService;
