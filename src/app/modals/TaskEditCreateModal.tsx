import React from "react";
import {Input, DatePicker} from "antd";
import { Task as TaskType } from "../../models/task.model";
import {BaseModal} from "./BaseModal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface TaskEditCreateModalProps {
    isOpen: boolean;
    task: TaskType;
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
        <BaseModal
            title={isEditMode ? "Edit Task" : "Create Task"}
            isOpen={isOpen}
            onOk={onSave}
            onCancel={onCancel}
            okText={isEditMode ? "Save Changes" : "Create"}
            okType={"primary"}>
            <Input
                placeholder="Task Name"
                value={task.name}
                onChange={(e) =>
                    onTaskChange({...task, name: e.target.value})
                }
                style={{marginBottom: "10px"}}
            />
            <Input.TextArea
                placeholder="Task Description"
                value={task.description}
                onChange={(e) =>
                    onTaskChange({...task, description: e.target.value})
                }
                style={{marginBottom: "10px"}}
            />
            <DatePicker
                placeholder="Due Date"
                value={task?.dueDate ? dayjs.utc(task?.dueDate).local() : null}
                onChange={(date) => {
                    if (date && date.isValid()) {
                        onTaskChange({
                            ...task,
                            dueDate: date.toDate()
                        });
                    }
                }}
                format="YYYY-MM-DD HH:mm"
                showTime
                style={{marginBottom: "10px"}}
            />
            {/*<DatePicker.RangePicker*/}
            {/*    placeholder={['Start date', 'End date']}*/}
            {/*    allowEmpty={[false, true]}*/}
            {/*/>*/}
        </BaseModal>

    );
};