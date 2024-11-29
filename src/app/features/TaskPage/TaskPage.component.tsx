import React, {useEffect, useState} from 'react';
import {Task} from "../../../models/task.model";
import {TaskList} from "../TaskList/TaskList.component";
import {ModalType} from "../../enums/ModalType";
import {TaskEditCreateModal} from "../../modals/TaskEditCreateModal";
import {TaskDeleteModal} from "../../modals/TaskDeleteModal";
import {SaveOutlined} from "@ant-design/icons";
import {Button} from "antd";
import TaskApi from "../../api/task.api";

export const TaskPageComponent: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [modalType, setModalType] = useState<ModalType | null>(null);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);

    useEffect(() => {
        console.log("Modal Type Updated:", modalType, "Current Task Updated:", currentTask);
    }, [modalType, currentTask]);

    useEffect(() => {
        const fetchTasks = () => {
            try {
                const fetchedTasks = TaskApi.getAllTasks();
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks()
    }, []);

    const openModal = (modalType: ModalType, task?: Task) => {
        setModalType(modalType);
        if (modalType === ModalType.Create) {
            setCurrentTask({
                id: 0,
                name: "",
                description: "",
                dueDate: new Date(),
                isDone: false,
            });
        } else if (task) {
            setCurrentTask(task);
        }
    };

    const closeModal = () => {
        setModalType(null)
    }

    const saveTask = () => {
        if (currentTask) {
            if (modalType === ModalType.Edit) {
                TaskApi.updateTask(currentTask);
            } else if (modalType === ModalType.Create) {
                TaskApi.addTask(currentTask);
            }
            const updatedTasks = TaskApi.getAllTasks();
            setTasks(updatedTasks);
        }
        closeModal();
    };

    const deleteTask = () => {
        if (currentTask) {
            TaskApi.deleteTask(currentTask.id);
            const updatedTasks = TaskApi.getAllTasks();
            setTasks(updatedTasks);
        }
        closeModal();
    };

    return (
        <div>
            <TaskList
                tasks={tasks}
                header={
                    <Button
                        icon={<SaveOutlined />}
                        onClick={() => openModal(ModalType.Create)}
                    >
                        Create
                    </Button>
                }
                onToggle={(id) =>
                    setTasks((prevTasks) =>
                        prevTasks.map((task) =>
                            task.id === id ? { ...task, isDone: !task.isDone } : task
                        )
                    )
                }
                onEdit={(id) => openModal(ModalType.Edit, tasks.find((task) => task.id === id)!)}
                onDelete={(id) => openModal(ModalType.Delete, tasks.find((task) => task.id === id)!) }

            />

            {modalType === ModalType.Create || ModalType.Edit ? (
                <TaskEditCreateModal
                    isOpen={modalType === ModalType.Edit || modalType === ModalType.Create}
                    task={currentTask!}
                    isEditMode={modalType === ModalType.Edit}
                    onSave={saveTask}
                    onCancel={closeModal}
                    onTaskChange={(updatedTask) => setCurrentTask(updatedTask)}
                />
            ) : null}

            {modalType === ModalType.Delete ? (
                <TaskDeleteModal
                    isOpen={modalType === ModalType.Delete}
                    task={currentTask!}
                    onConfirm={deleteTask}
                    onCancel={closeModal}
                />
            ) : null}
        </div>
    );
};
