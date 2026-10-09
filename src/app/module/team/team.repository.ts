import type { TeamRole } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import type { IGetAllTeamOptions } from "./team.interface.js";

class TeamRepository {
	async getOrganizationById(organizationId: string) {
		const organization = await prisma.organization.findUnique({
			where: {
				id: organizationId,
			},
		});

		return organization;
	}

	async getTeamByNameAndOrganizationId(name: string, organizationId: string) {
		const team = await prisma.team.findFirst({
			where: {
				name,
				organizationId,
			},
		});

		return team;
	}

	async createTeam(name: string, organizationId: string) {
		const team = await prisma.team.create({
			data: {
				name,
				organizationId,
			},
		});

		return team;
	}

	async getUserById(userId: string) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		return user;
	}

	async getTeamById(teamId: string) {
		const team = await prisma.team.findUnique({
			where: {
				id: teamId,
			},
		});

		return team;
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

	async checkMemberInTeam(teamId: string, userId: string) {
		const member = await prisma.teamMember.findFirst({
			where: {
				teamId,
				userId,
			},
		});

		return member;
	}

	async addMemberToTeam(teamId: string, userId: string, role: TeamRole) {
		const member = await prisma.teamMember.create({
			data: {
				teamId,
				userId,
				role,
			},
		});
		return member;
	}

	async getTeamMembers(teamId: string) {
		return prisma.teamMember.findMany({
			where: {
				teamId,
			},
			select: {
				id: true,
				teamId: true,
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

	async getAllTeams(options: IGetAllTeamOptions) {
		const where = options.organizationId
			? { organizationId: options.organizationId }
			: {};
		const [teams, total] = await Promise.all([
			prisma.team.findMany({
				where,
				skip: (options.page - 1) * options.limit,
				take: options.limit,
				orderBy: {
					createdAt: "desc",
				},
			}),
			prisma.team.count({ where }),
		]);

		return {
			teams,
			pagination: {
				page: options.page,
				limit: options.limit,
				total,
				totalPages: Math.ceil(total / options.limit),
			},
		};
	}
}

const teamRepo = new TeamRepository();
export default teamRepo;
