import React from "react";
import { useDraggable } from "@dnd-kit/core";
import {Task} from "../../../../models/task.model";

interface TaskCardProps {
    task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform} = useDraggable({
        id: task.id,
    });

    const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        padding: "10px",
        margin: "5px 0",
        borderRadius: "5px",
        backgroundColor: "#fff",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        cursor: "grab",
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {task.name}
        </div>
    );
};
