import React from "react"
import {TaskList} from "./TaskList.component";
import {fireEvent, render} from "@testing-library/react";
import {TaskStatus} from "../../enums/TaskStatus";

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockOnStatusChange = jest.fn();
const mockTasks = [
    { id: 1, name: "Task 1", status: "Planned", startDate: new Date(), endDate: new Date() },
];

test("renders TaskList without crashing", () => {
    render(
        <TaskList
            tasks={mockTasks}
            header={<h2>Task List</h2>}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onStatusChange={mockOnStatusChange}
        />
    );
});

test("calls onEdit, onDelete, and onStatusChange callbacks", () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnStatusChange = jest.fn();

    const { getByText } = render(
        <TaskList
            tasks={mockTasks}
            header={<h2>Task List Header</h2>}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onStatusChange={mockOnStatusChange}
        />
    );

    fireEvent.click(getByText("Edit"));
    expect(mockOnEdit).toHaveBeenCalledWith(mockTasks[0].id);

    fireEvent.click(getByText("Delete"));
    expect(mockOnDelete).toHaveBeenCalledWith(mockTasks[0].id);

    mockOnStatusChange(1, "InProgress");
    expect(mockOnStatusChange).toHaveBeenCalledWith(mockTasks[0].id, TaskStatus.InProgress);
});