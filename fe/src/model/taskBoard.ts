export interface TaskBoardData {
    key: string,
    taskType: string,
    name: string,
    assignee?: {
        color: string,
        name: string
        id?: string
    },
    status: string,
    dueDate?: Date
}
