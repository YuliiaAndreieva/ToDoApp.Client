import React, {useEffect} from "react";
import {Input, Select, Form, DatePicker} from "antd";
import { Task as TaskType } from "../../models/task.model";
import {BaseModal} from "./BaseModal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {TaskStatus} from "../enums/TaskStatus";
import {TaskStatusDisplayMap} from "../enums/TaskStatusDisplayMap";
import {descriptionValidator, rangeDateValidator, nameValidator, statusValidator} from "../validators/validators";
import isoWeek from "dayjs/plugin/isoWeek";

const { RangePicker } = DatePicker;
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
                dateRange: [
                    task.startDate ? dayjs.utc(task.startDate).local() : null,
                    task.endDate ? dayjs.utc(task.endDate).local() : null,
                ],
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
                    endDate: values.dateRange.endDate ?  dayjs.utc(values.dateRange.endDate).local() : null,
                    startDate: values.dateRange.startDate ?  dayjs.utc(values.dateRange.startDate).local() : null
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
                layout="vertical"
                onValuesChange={(changedValues, allValues) => {
                    const dateRange = allValues.dateRange || [];
                    onTaskChange({
                        ...task,
                        ...allValues,
                        startDate: dateRange[0] ? dayjs.utc(dateRange[0]).local() : null,
                        endDate: dateRange[1] ? dayjs.utc(dateRange[1]).local() : null,
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
                    label="Date Range"
                    name="dateRange"
                    rules={rangeDateValidator}
                >
                    <RangePicker
                        format="YYYY-MM-DD HH:mm"
                        showTime
                        disabledDate={(current) =>
                            current && (current.isBefore(startOfWeekForm) || current.isAfter(endOfWeekForm))
                        }
                        placeholder={["Select Start Date", "Select End Date"]}
                    />
                </Form.Item>
                <Form.Item
                    label="Task Status"
                    name="status"
                    rules={statusValidator}
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
