import React from "react";
import {TaskStatus} from "../../enums/TaskStatus";
import {render} from "@testing-library/react";
import {Task} from "./Task.component";
import { Task as TaskType } from "../../../models/task.model";

const mockTask: TaskType = {
    id: 1,
    name: "Sample Task",
    status: TaskStatus.InProgress,
    endDate: new Date("2024-12-13T12:17:38"),
    startDate: new Date("2024-12-10T12:17:38"),
};
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockOnStatusChange = jest.fn();

test("renders Task component without crashing", () => {
    render(
        <Task
            task={mockTask}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onStatusChange={mockOnStatusChange}
        />
    );
});
