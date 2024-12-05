import {TaskStatus} from "./TaskStatus";

export const TaskStatusDisplayMap: Record<TaskStatus, string> = {
    [TaskStatus.Planned]: "Planned",
    [TaskStatus.InProgress]: "In Progress",
    [TaskStatus.Done]: "Done",
};

