import { NotFoundError } from "../../utils/errorFormats.js";
import type { ICreateComment } from "./comment.interface.js";
import commentRepo from "./comment.repository.js";



const createComment = async (payload: ICreateComment) => {
    // check if the user exists
    const user = await commentRepo.getUserById(payload.userId);
    if (!user) {
        throw new NotFoundError("user not found");
    }

    // check if the task exists
    const task = await commentRepo.getTaskById(payload.taskId);
    if (!task) {
        throw new NotFoundError("task not found");
    }

    // create the comment
    const comment = await commentRepo.createComment(payload);
    // return the comment
    return comment;
}

const commentService = {
    createComment,
}
export default commentService;