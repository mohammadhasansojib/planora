import { uploadToCloudinary } from "../../lib/cloudinary.js";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../../utils/errorFormats.js";
import type {
	ICreateSubtask,
	ICreateTask,
	IGetAllTasksOptions,
} from "./task.interface.js";
import taskRepo from "./task.repository.js";

const ensureOrganizationMember = async (
	organizationId: string,
	userId: string,
) => {
	const member = await taskRepo.getOrganizationMember(organizationId, userId);
	if (!member) {
		throw new ForbiddenError("You are not a member of this organization");
	}
};

const createTask = async (taskData: ICreateTask, requestingUserId: string) => {
	const project = await taskRepo.getProjectById(taskData.projectId);
	if (!project) {
		throw new NotFoundError("Project not found");
	}

	const team = await taskRepo.getTeamById(project.teamId);
	if (!team) {
		throw new NotFoundError("Project team not found");
	}
	await ensureOrganizationMember(team.organizationId, requestingUserId);

	if (taskData.sprintId) {
		const sprint = await taskRepo.getSprintById(taskData.sprintId);
		if (!sprint) {
			throw new NotFoundError("Sprint not found");
		}
		if (sprint.projectId !== project.id) {
			throw new BadRequestError("Sprint must belong to the selected project");
		}
	}

	return taskRepo.createTask(taskData);
};

const assignTaskToSprint = async (
	taskId: string,
	sprintId: string,
	requestingUserId: string,
) => {
	const task = await taskRepo.getTaskById(taskId);
	if (!task) {
		throw new NotFoundError("Task not found");
	}

	const project = await taskRepo.getProjectById(task.projectId);
	if (!project) {
		throw new NotFoundError("Project not found");
	}
	const team = await taskRepo.getTeamById(project.teamId);
	if (!team) {
		throw new NotFoundError("Project team not found");
	}
	await ensureOrganizationMember(team.organizationId, requestingUserId);

	const sprint = await taskRepo.getSprintById(sprintId);
	if (!sprint) {
		throw new NotFoundError("Sprint not found");
	}
	if (sprint.projectId !== task.projectId) {
		throw new BadRequestError("Sprint must belong to the task's project");
	}

	if (task.sprintId === sprintId) {
		throw new BadRequestError("Task is already assigned to this sprint");
	}

	return taskRepo.assignTaskToSprint(taskId, sprintId);
};

const createSubtask = async (
	payload: ICreateSubtask,
	requestingUserId: string,
) => {
	const task = await taskRepo.getTaskById(payload.taskId);
	if (!task) {
		throw new NotFoundError("Task not found");
	}

	const project = await taskRepo.getProjectById(task.projectId);
	if (!project) {
		throw new NotFoundError("Project not found");
	}
	const team = await taskRepo.getTeamById(project.teamId);
	if (!team) {
		throw new NotFoundError("Project team not found");
	}
	await ensureOrganizationMember(team.organizationId, requestingUserId);

	return taskRepo.createSubtask(payload);
};

const addAttachment = async (
	file: Express.Multer.File,
	taskId: string,
	requestingUserId: string,
) => {
	const task = await taskRepo.getTaskById(taskId);
	if (!task) {
		throw new NotFoundError("Task not found");
	}

	const project = await taskRepo.getProjectById(task.projectId);
	if (!project) {
		throw new NotFoundError("Project not found");
	}
	const team = await taskRepo.getTeamById(project.teamId);
	if (!team) {
		throw new NotFoundError("Project team not found");
	}
	await ensureOrganizationMember(team.organizationId, requestingUserId);

	const user = await taskRepo.getUserById(requestingUserId);
	if (!user) {
		throw new NotFoundError("User not found");
	}

	const uploadedFile = await uploadToCloudinary(file.buffer);

	const attachment = await taskRepo.createTaskAttachment(
		uploadedFile.secure_url,
		file.originalname,
		user.id,
		task.id,
	);

	return attachment;
};

const getAllTasks = async (
	options: IGetAllTasksOptions,
	requestingUserId: string,
) => {
	await ensureOrganizationMember(options.organizationId, requestingUserId);
	return taskRepo.getAllTasks(options);
};

const taskService = {
	createTask,
	assignTaskToSprint,
	createSubtask,
	addAttachment,
	getAllTasks,
};
export default taskService;
