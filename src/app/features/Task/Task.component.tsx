import React from "react";
import { Checkbox, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Task as TaskType } from "../../../models/task.model";
import './Task.styles.scss';

interface TaskProps {
    task: TaskType;
    onToggle: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const Task: React.FC<TaskProps> = ({ task, onToggle, onEdit, onDelete }) => {
    return (
        <div className='task-item'>
            <Checkbox checked={task.isDone} onChange={() => onToggle(task.id)}>
                {task.name}
            </Checkbox>
            <div className='task-item-buttons'>
                <Button icon={<EditOutlined />} onClick={() => onEdit(task.id)}>
                    Edit
                </Button>
                <Button icon={<DeleteOutlined />} onClick={() => onDelete(task.id)} danger>
                    Delete
                </Button>
            </div>
        </div>
    );
};
;
