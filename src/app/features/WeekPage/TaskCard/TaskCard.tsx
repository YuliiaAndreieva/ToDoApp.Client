import React from "react";
import { useDraggable } from "@dnd-kit/core";
import {Task} from "../../../../models/task.model";
import "./TaskCard.styles.css";

interface TaskCardProps {
    task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform} = useDraggable({
        id: task.id,
    });

    const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={"task-card"}
            {...listeners}
            {...attributes}
        >
            {task.name}
        </div>
    );
};
