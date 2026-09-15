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

	async getAllProjects(options: IGetAllProjectsOptions) {
		let skip: number | undefined;
		if (options.page) skip = options.page - 1;
		
		let take: number | undefined;
		if (options.limit) take = options.limit;

		const projects = await prisma.project.findMany({
			skip,
			take,
		});

		return projects;
	}
}

const projectRepo = new ProjectRepository();

export default projectRepo;