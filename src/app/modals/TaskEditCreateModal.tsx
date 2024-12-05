import React, {useEffect} from "react";
import {Input, DatePicker, Select, Form} from "antd";
import { Task as TaskType } from "../../models/task.model";
import {BaseModal} from "./BaseModal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {TaskStatus} from "../enums/TaskStatus";
import {TaskStatusDisplayMap} from "../enums/TaskStatusDisplayMap";
import {descriptionValidator, dueDateValidator, nameValidator} from "../validators/validators";
import isoWeek from "dayjs/plugin/isoWeek";


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

interface TaskEditCreateModalProps {
    isOpen: boolean;
    task: TaskType;
    isEditMode: boolean;
    onSave: (updatedTask: TaskType) => void;
    onCancel: () => void;
    onTaskChange: (updatedTask: TaskType) => void;
}

export const TaskEditCreateModal: React.FC<TaskEditCreateModalProps> = ({
        isOpen,
        task,
        isEditMode,
        onSave,
        onCancel,
        onTaskChange
    }) => {

    const [form] = Form.useForm();
    const startOfWeekForm = dayjs().startOf("isoWeek");
    const endOfWeekForm = startOfWeekForm.add(7, "days");

    useEffect(() => {
        if (task) {
            form.setFieldsValue({
                name: task.name || "",
                description: task.description || "",
                dueDate: task.dueDate ? dayjs.utc(task.dueDate).local() : null,
                status: task.status || TaskStatus.Planned,
            });
        }
    }, [task, form]);

    const handleSave = () => {
        form
            .validateFields()
            .then((values) => {
                const updatedTask = {
                    ...task,
                    ...values,
                    dueDate: values.dueDate ?  dayjs.utc(task?.dueDate).local() : null,
                };
                onSave(updatedTask);
            })
            .catch((errorInfo) => {
                console.error("Validation Failed:", errorInfo);
            });
    };

    return (
        <BaseModal
            title={isEditMode ? "Edit Task" : "Create Task"}
            isOpen={isOpen}
            onOk={handleSave}
            onCancel={onCancel}
            okText={isEditMode ? "Save Changes" : "Create"}
            okType={"primary"}
        >
            <Form
                form={form}
                initialValues={{
                    name: task?.name || "",
                    description: task?.description || "",
                    dueDate: task?.dueDate ? dayjs.utc(task.dueDate).local() : null,
                    status: task?.status || TaskStatus.Planned,
                }}
                layout="vertical"
                onValuesChange={(changedValues, allValues) => {
                    onTaskChange({
                        ...task,
                        ...allValues,
                        dueDate: allValues.dueDate ? allValues.dueDate.toDate() : null,
                    });
                }}
            >
                <Form.Item
                    label="Task Name"
                    name="name"
                    rules={nameValidator}
                >
                    <Input placeholder="Task Name" />
                </Form.Item>
                <Form.Item
                    label="Task Description"
                    name="description"
                    rules={descriptionValidator}
                >
                    <Input.TextArea placeholder="Task Description" />
                </Form.Item>
                <Form.Item
                    label="Due Date"
                    name="dueDate"
                    rules={dueDateValidator}
                >
                    <DatePicker
                        format="YYYY-MM-DD HH:mm"
                        showTime
                        disabledDate={(current) =>
                            current && (current.isBefore(startOfWeekForm) || current.isAfter(endOfWeekForm))
                        }
                        placeholder="Select Due Date"
                    />
                </Form.Item>
                <Form.Item
                    label="Task Status"
                    name="status"
                    rules={[{ required: true, message: "Please select a task status" }]}
                >
                    <Select>
                        {Object.values(TaskStatus).map((status) => (
                            <Select.Option key={status} value={status}>
                                {TaskStatusDisplayMap[status]} {}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </BaseModal>
    );
};
