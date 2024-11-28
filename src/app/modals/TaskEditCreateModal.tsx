import React from "react";
import {Modal, Input, DatePicker} from "antd";
import { Task as TaskType } from "../../models/task.model";

interface TaskEditCreateModalProps {
    isOpen: boolean;
    task: TaskType | null;
    isEditMode: boolean;
    onSave: () => void;
    onCancel: () => void;
    onTaskChange: (updatedTask: TaskType) => void;
}

export const TaskEditCreateModal: React.FC<TaskEditCreateModalProps> = ({
        isOpen,
        task,
        isEditMode,
        onSave,
        onCancel,
        onTaskChange,
    }) => {
    if (!task) return null;

    return (
        <Modal
            title={isEditMode ? "Edit Task" : "Create Task"}
            open={isOpen}
            onOk={onSave}
            onCancel={onCancel}
            okText={isEditMode ? "Save Changes" : "Create"}
        >
            <Input
                placeholder="Task Name"
                value={task.name}
                onChange={(e) =>
                    onTaskChange({ ...task, name: e.target.value })
                }
                style={{ marginBottom: "10px" }}
            />
            <Input.TextArea
                placeholder="Task Description"
                value={task.description}
                onChange={(e) =>
                    onTaskChange({ ...task, description: e.target.value })
                }
                style={{ marginBottom: "10px" }}
            />
            <DatePicker
                placeholder="Select Due Date"
                value={task.dueDate ? null : null}
                onChange={(date) =>
                    onTaskChange({ ...task, dueDate: date || "" })
                }
                style={{ width: "100%" }}
            />
        </Modal>
    );
};
