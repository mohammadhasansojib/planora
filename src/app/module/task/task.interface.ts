


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