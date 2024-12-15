import React from "react";
import {TaskStatus} from "../../enums/TaskStatus";
import {fireEvent,  render, screen, waitFor} from "@testing-library/react";
import {Task} from "./Task.component";
import { Task as TaskType } from "../../../models/task.model";
import {TaskStatusDisplayMap} from "../../enums/TaskStatusDisplayMap";

const mockTask: TaskType = {
    id: 1,
    name: "Sample Task",
    status: TaskStatus.InProgress,
    endDate: new Date("2024-12-13T12:17:38Z"),
    startDate: new Date("2024-12-10T12:17:38Z"),
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

    expect(screen.getByText("Sample Task")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
});

test("renders Task component with local date", () => {
    render(
        <Task
            task={mockTask}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onStatusChange={mockOnStatusChange}
        />
    );

    expect(screen.getByText("13 December, 14:17")).toBeInTheDocument();
});

test("calls onDelete callback when Delete button is clicked", () => {
    render(
        <Task
            task={mockTask}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onStatusChange={mockOnStatusChange}
        />
    );
    fireEvent.click(screen.getByRole("button", { name: /delete/i }))
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
})

test("calls onEdit callback when Edit button is clicked", () => {
    render(
        <Task
            task={mockTask}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onStatusChange={mockOnStatusChange}
        />
    );
    fireEvent.click(screen.getByRole("button", { name: /edit/i }))
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask.id)
})

test("open status dropdown and have already chosen task status", async () => {
    render(
        <Task
            task={mockTask}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onStatusChange={mockOnStatusChange}
        />
    );
    fireEvent.click(screen.getByText("In Progress"));
    fireEvent.mouseDown(screen.getByTestId("task-status-select"));

    await waitFor(() => {
        const doneOption = document.querySelector(".ant-select-selection-item");
        expect(doneOption).toHaveTextContent("In Progress");
    });
})

test("closes dropdown on blur", () => {
    render(
        <Task
            task={mockTask}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onStatusChange={mockOnStatusChange}
        />
    );

    fireEvent.click(screen.getByText(TaskStatusDisplayMap[TaskStatus.InProgress]));
    fireEvent.mouseDown(screen.getByTestId("task-status-select"));

    expect(screen.getByRole("combobox")).toBeInTheDocument();

    fireEvent.blur(screen.getByRole("combobox"));

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
});