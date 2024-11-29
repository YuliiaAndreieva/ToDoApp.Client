import React from "react";
import { Task as TaskType } from "../../models/task.model";
import {BaseModal} from "./BaseModal";

interface TaskDeleteModalProps {
    isOpen: boolean;
    task: TaskType;
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
        <BaseModal
            title="Delete Task"
            isOpen={isOpen}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Delete"
            okType={"danger"}
        >
            <p>Are you sure you want to delete the task {task?.name}?</p>
        </BaseModal>
    );
};
