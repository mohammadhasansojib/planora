import { OrganizationRole } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import type { ICreateOrganization } from "./organization.interface.js";


class OrganizationRepo {
    async createOrganization(payload: ICreateOrganization, userId: string) {
        const organization = await prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    ...payload,
                },
            });

            await tx.organizationMember.create({
                data: {
                    organizationId: org.id,
                    userId,
                    role: OrganizationRole.OWNER,
                }
            });

            return org;
        });

        return organization;
    }

    async getUsersAllOrg(userId: string) {
        const organizationMembers = await prisma.organizationMember.findMany({
            where: {
                userId,
            },
            include: {
                organization: true,
            }
        });

        const organizations = organizationMembers.map(orgMember => orgMember.organization);

        return organizations;
    }

    async getOrganizationById(id: string) {
        const organization = await prisma.organization.findUnique({
            where: {
                id,
            }
        })

        return organization;
    }

    async getUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: {
                id,
            }
        });

        return user;
    }

    async getOrgMemberByUserandOrgId(organizationId: string, userId: string) {
        const member = await prisma.organizationMember.findUnique({
            where: {
                userId_organizationId: {
                    organizationId,
                    userId,
                },
            }
        });

        return member;
    }

    async createOrganizationMember(organizationId: string, userId: string) {
        const member = await prisma.organizationMember.create({
            data: {
                organizationId,
                userId,
                role: OrganizationRole.MEMBER,
            }
        });

        return member;
    }

}

export const orgRepo = new OrganizationRepo();