


export interface ICreateTask {
    title: string
    description?: string
    sprintId?: string
    projectId: string
}

export interface ICreateSubtask {
    title: string
    description?: string
    taskId: string
}

export interface IGetAllTasksOptions {
    page?: number
    limit?: number
    sortBy?: "createdAt"
    order?: "asc" | "desc"
    term?: string
}