import { NotFoundError } from "../../utils/errorFormats.js";
import type { ICreateTask } from "./task.interface.js";
import taskRepo from "./task.repository.js";

const createTask = async (taskData: ICreateTask) => {

    // check if the project exists
    const project = await taskRepo.getProjectById(taskData.projectId);
    if (!project) {
        throw new NotFoundError("Project not found");
    }

    // check if the sprint exists (if sprintId is provided)
    if (taskData.sprintId) {
        const sprint = await taskRepo.getSprintById(taskData.sprintId);
        if (!sprint) {
            throw new NotFoundError("Sprint not found");
        }
    }

    // create the task in the database
    const task = await taskRepo.createTask(taskData);

    // return the task
    return task;
}

const assignTaskToSprint = async (taskId: string, sprintId: string) => {
    // check if the task exists
    const task = await taskRepo.getTaskById(taskId);
    if (!task) {
        throw new NotFoundError("Task not found");
    }

    // check if the sprint exists
    const sprint = await taskRepo.getSprintById(sprintId);
    if (!sprint) {
        throw new NotFoundError("Sprint not found");
    }

    // check if the task is already assigned to a sprint
    const isTaskAlreadyAssigned = await taskRepo.getTaskByIdWithSprintId(taskId, sprintId);
    if (isTaskAlreadyAssigned) {
        throw new NotFoundError("Task is already assigned to this sprint");
    }

    // assign the task to the sprint in the database
    const updatedTask = await taskRepo.assignTaskToSprint(taskId, sprintId);

    // return the updated task
    return updatedTask;
}

const taskService = {
    createTask,
    assignTaskToSprint,
};
export default taskService;