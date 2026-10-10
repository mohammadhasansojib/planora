import { prisma } from "../../lib/prisma.js";
import type { ICreateComment } from "./comment.interface.js";

class CommentRepository {
	async getUserById(userId: string) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		return user;
	}

	async getTaskById(taskId: string) {
		const task = await prisma.task.findUnique({
			where: {
				id: taskId,
			},
		});

		return task;
	}

	async getProjectById(projectId: string) {
		return prisma.project.findUnique({
			where: { id: projectId },
		});
	}

	async getTeamById(teamId: string) {
		return prisma.team.findUnique({
			where: { id: teamId },
		});
	}

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

	async createComment(payload: ICreateComment) {
		const comment = await prisma.comment.create({
			data: payload,
			include: {
				user: {
					select: {
						username: true,
					},
				},
			},
		});

		return comment;
	}

	async getCommentsByTaskId(taskId: string) {
		return prisma.comment.findMany({
			where: { taskId },
			select: {
				id: true,
				content: true,
				userId: true,
				taskId: true,
				createdAt: true,
				updatedAt: true,
				user: {
					select: {
						username: true,
					},
				},
			},
			orderBy: {
				createdAt: "asc",
			},
		});
	}
}

const commentRepo = new CommentRepository();
export default commentRepo;
