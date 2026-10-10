import { prisma } from "../../lib/prisma.js";
import type {
	ICreateSubtask,
	ICreateTask,
	IGetAllTasksOptions,
} from "./task.interface.js";

const taskRelations = {
	subtasks: {
		select: {
			id: true,
			title: true,
			description: true,
			taskId: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: {
			createdAt: "asc",
		},
	},
	attachments: {
		select: {
			id: true,
			taskId: true,
			userId: true,
			originalName: true,
			fileURL: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: {
			createdAt: "asc",
		},
	},
	project: {
		select: {
			id: true,
			name: true,
		},
	},
	sprint: {
		select: {
			id: true,
			name: true,
			startTime: true,
			endTime: true,
		},
	},
} as const;

class TaskRepository {
	async getOrganizationMember(organizationId: string, userId: string) {
		return prisma.organizationMember.findUnique({
			where: {
				userId_organizationId: {
					organizationId,
					userId,
				},
			},
		});
	}

	async getTeamById(teamId: string) {
		return prisma.team.findUnique({
			where: { id: teamId },
		});
	}

	async getProjectById(projectId: string) {
		const project = await prisma.project.findUnique({
			where: { id: projectId },
		});
		return project;
	}

	async getSprintById(sprintId: string) {
		const sprint = await prisma.sprint.findUnique({
			where: { id: sprintId },
		});
		return sprint;
	}

	async createTask(taskData: ICreateTask) {
		const task = await prisma.task.create({
			data: taskData,
			include: taskRelations,
		});

		return task;
	}

	async getTaskById(taskId: string) {
		const task = await prisma.task.findUnique({
			where: { id: taskId },
		});
		return task;
	}

	async getUserById(userId: string) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});
		return user;
	}

	async createTaskAttachment(
		fileURL: string,
		originalName: string,
		userId: string,
		taskId: string,
	) {
		const attachment = await prisma.attachment.create({
			data: {
				fileURL,
				originalName,
				userId,
				taskId,
			},
		});

		return attachment;
	}

	async assignTaskToSprint(taskId: string, sprintId: string) {
		const updatedTask = await prisma.task.update({
			where: { id: taskId },
			data: { sprintId: sprintId },
			include: taskRelations,
		});

		return updatedTask;
	}

	async createSubtask(payload: ICreateSubtask) {
		const subtask = await prisma.subtask.create({
			data: payload,
		});

		return subtask;
	}

	async getAllTasks(options: IGetAllTasksOptions) {
		const where = {
			project: {
				team: {
					organizationId: options.organizationId,
				},
			},
			...(options.term
				? {
						OR: [
							{
								title: { contains: options.term, mode: "insensitive" as const },
							},
							{
								description: {
									contains: options.term,
									mode: "insensitive" as const,
								},
							},
						],
					}
				: {}),
		};
		const [tasks, total] = await Promise.all([
			prisma.task.findMany({
				where,
				include: taskRelations,
				skip: (options.page - 1) * options.limit,
				take: options.limit,
				orderBy: [{ [options.sortBy]: options.order }, { id: "asc" }],
			}),
			prisma.task.count({ where }),
		]);

		return {
			tasks,
			pagination: {
				page: options.page,
				limit: options.limit,
				total,
				totalPages: Math.ceil(total / options.limit),
			},
		};
	}
}

const taskRepo = new TaskRepository();
export default taskRepo;
