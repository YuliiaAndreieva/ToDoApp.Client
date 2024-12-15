import {QueryClient, QueryClientProvider} from "react-query";
import {TaskPageComponent} from "./TaskPage.component";
import {fireEvent, render, waitFor, screen} from "@testing-library/react";
import TaskApi from "../../api/task.api";
import React from "react"

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

jest.mock("../../api/task.api", () => ({
    getAllTasks: jest.fn(),
    addTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
}));

const mockTasks = [
    { id: 1, name: "Task 1", description: "Description 1", startDate: new Date(), endDate: new Date(), status: "Planned" },
    { id: 2, name: "Task 2", description: "Description 2", startDate: new Date(), endDate: new Date(), status: "InProgress" },
];

const queryClient = new QueryClient();

describe("TaskPageComponent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (TaskApi.getAllTasks as jest.Mock).mockResolvedValue(mockTasks);
        (TaskApi.addTask as jest.Mock).mockResolvedValue({});
        (TaskApi.updateTask as jest.Mock).mockResolvedValue({});
        (TaskApi.deleteTask as jest.Mock).mockResolvedValue({});
    });

    test("renders without crashing", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskPageComponent />
            </QueryClientProvider>
        );

        await waitFor(() => expect(screen.getByText("Create")).toBeInTheDocument());
        expect(screen.getByText("Task 1")).toBeInTheDocument();
        expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    test("opens Create modal when clicking Create button", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskPageComponent />
            </QueryClientProvider>
        );

        fireEvent.click(screen.getByText(/create/i));

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Save")).toBeInTheDocument();
            expect(screen.getByText("Cancel")).toBeInTheDocument();
        });
    });

    test("calls addTaskMutation on saving new task", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskPageComponent />
            </QueryClientProvider>
        );

        fireEvent.click(screen.getByText(/create/i));

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Save")).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText("Task Name"), {
            target: { value: "Test Task" },
        });

        fireEvent.change(screen.getByPlaceholderText("Task Description"), {
            target: { value: "Test Description" },
        });

        fireEvent.change(screen.getByPlaceholderText("Select Start Date"), {
            target: { value: "2024-12-15 10:00" },
        });

        fireEvent.change(screen.getByPlaceholderText("Select End Date"), {
            target: { value: "2024-12-16 10:00" },
        });

        fireEvent.click(screen.getByText("Save"));

        await waitFor(() => {
            expect(TaskApi.addTask).toHaveBeenCalledTimes(1);
            expect(TaskApi.addTask).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Test Task",
                    description: "Test Description",
                })
            );
        });
    });

    test("opens Edit modal when clicking Edit button", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskPageComponent />
            </QueryClientProvider>
        );

        fireEvent.click(screen.getAllByText("Edit")[0]);

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Save")).toBeInTheDocument();
            expect(screen.getByText("Cancel")).toBeInTheDocument();
        });
    });

    test("opens Edit modal and updates task", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskPageComponent />
            </QueryClientProvider>
        );

        fireEvent.click(screen.getAllByText("Edit")[0]);

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Save"));

        await waitFor(() => {
            expect(TaskApi.updateTask).toHaveBeenCalled();
        });
    });

    test("opens Delete modal when clicking Delete button", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskPageComponent />
            </QueryClientProvider>
        );

        fireEvent.click(screen.getAllByText("Delete")[0]);

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Confirm")).toBeInTheDocument();
            expect(screen.getByText("Cancel")).toBeInTheDocument();
        });
    });

    test("opens Delete modal and deletes task", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TaskPageComponent />
            </QueryClientProvider>
        );

        fireEvent.click(screen.getAllByText("Delete")[0]);

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Confirm")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(TaskApi.deleteTask).toHaveBeenCalled();
        });
    });
});