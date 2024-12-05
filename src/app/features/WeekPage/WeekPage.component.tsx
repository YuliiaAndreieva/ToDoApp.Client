import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import './WeekPage.styles.scss';
import {Task} from "../../../models/task.model";
import TaskApi from "../../api/task.api";
import {DayColumn} from "./DayColumn/DayColumn";

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

    useEffect(() => {
        if (tasks.length <= 0) {
            return;
        }
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const groupedTasks: Record<string, Task[]> = {};
        daysOfWeek.forEach((day) => {
            groupedTasks[day] = [];
        });
        tasks.forEach((task) => {
            const taskDate = new Date(task.dueDate);
            if (taskDate >= startOfWeek && taskDate <= endOfWeek) {
                const dayName = daysOfWeek[taskDate.getDay() === 0 ? 6 : taskDate.getDay() - 1];
                groupedTasks[dayName].push(task);
            }
        });
        setTasksByDay(groupedTasks);
    }, [tasks]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        console.log(active, over);
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

            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

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

            setTasksByDay({
                ...tasksByDay,
                [sourceDay]: sourceTasks.filter((task) => task.id !== active.id),
                [targetDay]: [...targetTasks, movingTask],
            });

            console.log("TARGET DATE", targetDate);
            updateTaskMutation.mutate({
                ...movingTask,
                dueDate: targetDate,
            });
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading tasks</div>;

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className={"week-view"}>
                {daysOfWeek.map((day) => (
                    <SortableContext key={day} items={tasksByDay[day] ?? []} strategy={verticalListSortingStrategy}>
                        <DayColumn key={day} day={day} tasks={tasksByDay[day]} />
                    </SortableContext>
                ))}
            </div>
        </DndContext>
    );
};
