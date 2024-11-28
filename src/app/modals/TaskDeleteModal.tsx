import React from "react";
import { Modal } from "antd";
import { Task as TaskType } from "../../models/task.model";

interface TaskDeleteModalProps {
    isOpen: boolean;
    task: TaskType | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export const TaskDeleteModal: React.FC<TaskDeleteModalProps> = ({
        isOpen,
        task,
        onConfirm,
        onCancel,
    }) => {
    return (
        <Modal
            title="Delete Task"
            open={isOpen}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Delete"
            okButtonProps={{ danger: true }}
        >
            <p>Are you sure you want to delete the task "{task?.name}"?</p>
        </Modal>
    );
};
