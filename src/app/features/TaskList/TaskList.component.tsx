import React from 'react';
import {List} from 'antd';
import {Task} from "../Task/Task.component";
import { Task as TaskType } from "../../../models/task.model";
import './TaskList.styles.scss';

interface TaskListProps {
    tasks: TaskType[];
    header: React.ReactNode;
    onToggle: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, header, onToggle, onEdit, onDelete }) => {
    return (
        <div className="task-list-container">
            <List className="task-list"
                header={header}
                itemLayout="horizontal"
                dataSource={tasks}
                renderItem={(task: TaskType) => (
                    <List.Item >
                        <Task task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
                    </List.Item>
                )}
            />
        </div>
    );
};
