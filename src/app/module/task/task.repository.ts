import { prisma } from "../../lib/prisma.js";
import type { ICreateSubtask, ICreateTask } from "./task.interface.js";

class TaskRepository {
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

    async createTaskAttachment(fileURL: string, userId: string, taskId: string) {
        const attachment = await prisma.attachment.create({
            data: {
                fileURL,
                userId,
                taskId,
            }
        });
        
        return attachment;
    }

    async getTaskByIdWithSprintId(taskId: string, sprintId: string) {
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                sprintId: sprintId,
            },
        });
        return task;
    }

    async assignTaskToSprint(taskId: string, sprintId: string) {
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { sprintId: sprintId },
        });

        return updatedTask;
    }

    async createSubtask(payload: ICreateSubtask) {
        const subtask = await prisma.subtask.create({
            data: payload,
        });

        return subtask;
    }

}

const taskRepo = new TaskRepository();
export default taskRepo;