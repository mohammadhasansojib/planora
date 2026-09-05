import { prisma } from "../../lib/prisma.js";
import type { ICreateComment } from "./comment.interface.js";


class CommentRepository {
    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        return user;
    }

    async getTaskById(taskId: string) {
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            }
        });

        return task;
    }

    async createComment(payload: ICreateComment) {
        const comment = await prisma.comment.create({
            data: payload,
        });

        return comment;
    }
}


const commentRepo = new CommentRepository();
export default commentRepo;