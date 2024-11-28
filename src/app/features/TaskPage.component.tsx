import React, {useEffect, useState} from 'react';
import {Task} from "../../models/task.model";
import {TaskList} from "./TaskList/TaskList.component";
import {ModalType} from "../types/ModalType";
import {TaskEditCreateModal} from "../modals/TaskEditCreateModal";
import {TaskDeleteModal} from "../modals/TaskDeleteModal";
import {SaveOutlined} from "@ant-design/icons";
import {Button} from "antd";

export const TaskPageComponent: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, name: 'Test Task', description: 'Test Description', dueDate: '2024-11-30', isDone: false },
        { id: 2, name: 'Test Task', description: 'Test Description', dueDate: '2024-11-30', isDone: false },
    ]);

    const [modalType, setModalType] = useState<ModalType>(null);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);

    useEffect(() => {
        console.log("Modal Type Updated:", modalType, "Current Task Updated:", currentTask);
    }, [modalType, currentTask]);


    const openModal = (type: ModalType, task: Task | null = null) => {
        const emptyTask: Task = { id:1, name: "", description: "", dueDate: "", isDone: false };
        setModalType(type);
        setCurrentTask(task || (type === "create" ? emptyTask : null));
    };

    const closeModal = () => {
        setModalType(null);
        setCurrentTask(null);
    };

    const saveTask = () => {
        if (currentTask) {
            if (modalType === "edit") {
                setTasks((prevTasks) =>
                    prevTasks.map((task) => (task.id === currentTask.id ? currentTask : task))
                );
            } else if (modalType === "create") {
                setTasks((prevTasks) => [...prevTasks, currentTask]);
            }
        }
        closeModal();
    };

    const deleteTask = () => {
        if (currentTask) {
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== currentTask.id));
        }
        closeModal();
    };


    return (
        <div>
            <Button icon={<SaveOutlined />} onClick={() => openModal("create")}>
                Create
            </Button>
            <TaskList
                tasks={tasks}
                onToggle={(id) =>
                    setTasks((prevTasks) =>
                        prevTasks.map((task) =>
                            task.id === id ? {...task, isDone: !task.isDone} : task
                        )
                    )
                }
                onEdit={(id) => openModal("edit", tasks.find((task) => task.id === id)!)}
                onDelete={(id) => openModal("delete", tasks.find((task) => task.id === id)!)}
            />

            {modalType === "edit" || modalType === "create" ? (
                <TaskEditCreateModal
                    isOpen={modalType === "edit" || modalType === "create"}
                    task={currentTask}
                    isEditMode={modalType === "edit"}
                    onSave={saveTask}
                    onCancel={closeModal}
                    onTaskChange={(updatedTask) => setCurrentTask(updatedTask)}
                />
            ) : null}

            {modalType === "delete" ? (
                <TaskDeleteModal
                    isOpen={modalType === "delete"}
                    task={currentTask}
                    onConfirm={deleteTask}
                    onCancel={closeModal}
                />
            ) : null}
        </div>
    );
};
