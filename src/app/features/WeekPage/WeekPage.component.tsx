import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import './WeekPage.styles.scss';
import {Task} from "../../../models/task.model";
import TaskApi from "../../api/task.api";
import {DayColumn} from "./DayColumn/DayColumn";
import {restrictToWindowEdges} from "@dnd-kit/modifiers";
import {Modal} from "antd";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


export const WeekPageComponent: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: tasks = [], isLoading, isError } = useQuery(["tasks"], TaskApi.getAllTasks);

    const updateTaskMutation = useMutation(TaskApi.updateTask, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks"]);
        },
    });

    const [tasksByDay, setTasksByDay] = useState<Record<string, Task[]>>(() => {
        const groupedTasks: Record<string, Task[]> = {};
        daysOfWeek.forEach((day) => {
            groupedTasks[day] = [];
        });
        return groupedTasks;
    });

    const getStartOfWeek = (): Date => {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() - (date.getUTCDay() === 0 ? 6 : date.getUTCDay() - 1));
        date.setUTCHours(0, 0, 0, 0); // Початок дня в UTC
        return date;
    };

    const getEndOfWeek = (startOfWeek: Date): Date => {
        const date = new Date(startOfWeek);
        date.setUTCDate(startOfWeek.getUTCDate() + 6);
        date.setUTCHours(23, 59, 59, 999); // Кінець дня в UTC
        return date;
    };

    useEffect(() => {
        if (tasks.length <= 0) {
            return;
        }
        const startOfWeek = getStartOfWeek();
        const endOfWeek = getEndOfWeek(startOfWeek);
        const groupedTasks: Record<string, Task[]> = {};
        daysOfWeek.forEach((day) => {
            groupedTasks[day] = [];
        });
        tasks.forEach((task) => {
            const taskDate = new Date(task.endDate);

            if (taskDate >= startOfWeek && taskDate <= endOfWeek) {
                const dayName = daysOfWeek[taskDate.getDay() === 0 ? 6 : taskDate.getDay() - 1];
                groupedTasks[dayName].push(task);
            }
        });
        setTasksByDay(groupedTasks);
    }, [tasks]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const sourceDay = Object.keys(tasksByDay).find((day) =>
            tasksByDay[day].some((task) => task.id === active.id)
        );
        const targetDay = over.id;

        if (sourceDay && targetDay && sourceDay !== targetDay) {
            const sourceTasks = [...tasksByDay[sourceDay]];
            const targetTasks = [...tasksByDay[targetDay]];

            const movingTask = sourceTasks.find((task) => task.id === active.id)!;

            const startOfWeek = getStartOfWeek();
            const daysMap: Record<string, number> = {
                Monday: 0,
                Tuesday: 1,
                Wednesday: 2,
                Thursday: 3,
                Friday: 4,
                Saturday: 5,
                Sunday: 6,
            };

            const targetDate = new Date(startOfWeek);
            targetDate.setDate(startOfWeek.getDate() + daysMap[targetDay]);

            const originalEndDate = new Date(movingTask.endDate);
            targetDate.setUTCHours(originalEndDate.getHours());
            targetDate.setUTCMinutes(originalEndDate.getMinutes());
            targetDate.setUTCSeconds(originalEndDate.getSeconds());
            targetDate.setUTCMilliseconds(originalEndDate.getMilliseconds());

            if (targetDate < new Date(movingTask.startDate)) {
                Modal.warning({
                    title: "Invalid Task Date",
                    content: "End date cannot be earlier than start date.",
                });
                return;
            }

            updateTaskMutation.mutate(
                {
                    ...movingTask,
                    endDate: targetDate,
                },
                {
                    onSuccess: () => {
                        setTasksByDay({
                            ...tasksByDay,
                            [sourceDay]: sourceTasks.filter((task) => task.id !== active.id),
                            [targetDay]: [...targetTasks, movingTask],
                        });
                    },
                    onError: (error) => {
                        console.error("Error updating task:", error);
                        Modal.error({
                            title: "Error",
                            content: "Failed to update the task on the server.",
                        });
                    },
                }
            );
        }
    };


    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading tasks</div>;

    return (
        <DndContext modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
            <div className="week-view">
                {daysOfWeek.map((day) => (
                    <SortableContext
                        key={day}
                        items={tasksByDay[day] ?? []}
                        strategy={verticalListSortingStrategy}
                    >
                        <DayColumn key={day} day={day} tasks={tasksByDay[day]} />
                    </SortableContext>
                ))}
            </div>
        </DndContext>
    );
};
