export const TaskStatus = {
    NOT_START: 0, // 未开始
    ON_GOING: 1, // 进行中
    SUCCESS: 2, // 成功
    FAILED: 3, // 失败
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
    id?: number,
    uuid: string;
    created_at: string;
    credits: number;
    user_uuid?: string;
    params?: string;
    status: TaskStatus;
}
  

