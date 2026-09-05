import { prisma } from "../../lib/prisma.js";
import type { ICreateSprint } from "./sprint.interface.js";


class SprintRepository {
    async createSprint(payload: ICreateSprint) {
        const sprint = await prisma.sprint.create({
            data: payload,
        });
        return sprint;
    }

    async getProjectById(projectId: string) {
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        return project;
    }

    async getSprintByNameAndProjectId(name: string, projectId: string) {
        const sprint = await prisma.sprint.findFirst({
            where: {
                name,
                projectId
            }
        });

        return sprint;
    }
}

const sprintRepo = new SprintRepository();
export default sprintRepo;