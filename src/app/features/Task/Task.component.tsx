import React, {useState} from "react";
import {Button, Select} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Task as TaskType } from "../../../models/task.model";
import './Task.styles.scss';
import dayjs from "dayjs";
import {TaskStatus} from "../../enums/TaskStatus";
import {TaskStatusDisplayMap} from "../../enums/TaskStatusDisplayMap";

interface TaskProps {
    task: TaskType;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, newStatus: string) => void;
}

export const Task: React.FC<TaskProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
    const [isEditingStatus, setIsEditingStatus] = useState(false);

    const handleStatusChange = (newStatus: string) => {
        onStatusChange(task.id, newStatus as TaskStatus);
        setIsEditingStatus(false);
    };

    return (
        <>
            <div className='task-props'>
                {task.name}
            </div>
            <div className='task-item-buttons'>
                <div
                    className={`status-container status-${task.status.toLowerCase()} ${
                        isEditingStatus ? "editing" : ""
                    }`}
                    onClick={() => !isEditingStatus && setIsEditingStatus(true)}
                >
                    {isEditingStatus ? (
                        <Select
                            defaultValue={task.status}
                            onChange={handleStatusChange}
                            style={{width: 150}}
                            autoFocus
                            onBlur={() => setIsEditingStatus(false)}
                        >
                            {Object.values(TaskStatus).map((status) => (
                                <Select.Option key={status} value={status}>
                                    {TaskStatusDisplayMap[status]} {}
                                </Select.Option>
                            ))}
                        </Select>
                    ) : (
                        <div className="status-display">
                            {TaskStatusDisplayMap[task.status as TaskStatus] || task.status}
                        </div>
                    )}
                </div>
                {dayjs.utc(task?.endDate).local().format("DD MMMM, HH:mm")}
                <Button icon={<EditOutlined/>} onClick={() => onEdit(task.id)}>
                    Edit
                </Button>
                <Button icon={<DeleteOutlined/>} onClick={() => onDelete(task.id)} danger>
                    Delete
                </Button>
            </div>
        </>
    );
};
