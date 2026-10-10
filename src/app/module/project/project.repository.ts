import type { ProjectRole } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import type { IGetAllProjectsOptions } from "./project.interface.js";

class ProjectRepository {
	async getTeamById(teamId: string) {
		const team = await prisma.team.findUnique({
			where: {
				id: teamId,
			},
		});

		return team;
	}

	async getOrganizationById(organizationId: string) {
		return prisma.organization.findUnique({
			where: {
				id: organizationId,
			},
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

	async getProjectByNameAndTeamId(name: string, teamId: string) {
		const project = await prisma.project.findFirst({
			where: {
				name,
				teamId,
			},
		});

		return project;
	}

	async createProject(name: string, teamId: string) {
		const project = await prisma.project.create({
			data: {
				name,
				teamId,
			},
		});

		return project;
	}

	async getUserById(userId: string) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		return user;
	}

	async getProjectById(projectId: string) {
		const project = await prisma.project.findUnique({
			where: {
				id: projectId,
			},
		});

		return project;
	}

	async checkMemberInProject(projectId: string, userId: string) {
		const member = await prisma.projectMember.findFirst({
			where: {
				projectId,
				userId,
			},
		});

		return member;
	}

	async addMemberToProject(
		projectId: string,
		userId: string,
		role: ProjectRole,
	) {
		const member = await prisma.projectMember.create({
			data: {
				projectId,
				userId,
				role,
			},
		});

		return member;
	}

	async getProjectMembers(projectId: string) {
		return prisma.projectMember.findMany({
			where: {
				projectId,
			},
			select: {
				id: true,
				projectId: true,
				userId: true,
				role: true,
				createdAt: true,
				updatedAt: true,
				user: {
					select: {
						username: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: "asc",
			},
		});
	}

	async getAllProjects(options: IGetAllProjectsOptions) {
		const where = options.organizationId
			? { team: { organizationId: options.organizationId } }
			: {};
		const [projects, total] = await Promise.all([
			prisma.project.findMany({
				where,
				select: {
					id: true,
					name: true,
					teamId: true,
					createdAt: true,
					updatedAt: true,
					team: {
						select: {
							id: true,
							name: true,
							organizationId: true,
						},
					},
					sprints: {
						select: {
							id: true,
							name: true,
							projectId: true,
							startTime: true,
							endTime: true,
							createdAt: true,
							updatedAt: true,
						},
						orderBy: {
							startTime: "asc",
						},
					},
				},
				skip: (options.page - 1) * options.limit,
				take: options.limit,
				orderBy: {
					createdAt: "desc",
				},
			}),
			prisma.project.count({ where }),
		]);

		return {
			projects,
			pagination: {
				page: options.page,
				limit: options.limit,
				total,
				totalPages: Math.ceil(total / options.limit),
			},
		};
	}
}

const projectRepo = new ProjectRepository();

export default projectRepo;
