import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {TaskCard} from "../TaskCard/TaskCard";
import {Task} from "../../../../models/task.model";
import './DayColumn.styles.css';

interface DayColumnProps {
    day: string;
    tasks: Task[];
}

export const DayColumn: React.FC<DayColumnProps> = ({ day, tasks }) => {
    const { setNodeRef } = useDroppable({ id: day });

    return (
        <div
            ref={setNodeRef}
            className={"day-column"}
        >
            <h3>{day}</h3>
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    );
};
