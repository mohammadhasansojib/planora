import type { TeamRole } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

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
}

const teamRepo = new TeamRepository();
export default teamRepo;
