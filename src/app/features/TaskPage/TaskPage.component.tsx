import React, {useEffect, useState} from 'react';
import {Task} from "../../../models/task.model";
import {TaskList} from "../TaskList/TaskList.component";
import {ModalType} from "../../enums/ModalType";
import {TaskEditCreateModal} from "../../modals/TaskEditCreateModal";
import {TaskDeleteModal} from "../../modals/TaskDeleteModal";
import {PlusCircleOutlined} from "@ant-design/icons";
import {Button} from "antd";
import TaskApi from "../../api/task.api";
import {useMutation, useQuery, useQueryClient} from "react-query";

export const TaskPageComponent: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: tasks = [], isLoading, isError } = useQuery(["tasks"], TaskApi.getAllTasks);
    const [modalType, setModalType] = useState<ModalType | null>(null);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);

    useEffect(() => {
        console.log("Modal Type Updated:", modalType, "Current Task Updated:", currentTask);
    }, [modalType, currentTask]);

    const addTaskMutation = useMutation(TaskApi.addTask, {
        onSuccess: () => queryClient.invalidateQueries(['tasks']),
    });

    const updateTaskMutation = useMutation(TaskApi.updateTask, {
        onSuccess: () => queryClient.invalidateQueries(["tasks"]),
    });

    const deleteTaskMutation = useMutation(TaskApi.deleteTask, {
        onSuccess: () => queryClient.invalidateQueries(["tasks"]),
    });

    const openModal = (modalType: ModalType, task?: Task) => {
        setModalType(modalType);
        if (modalType === ModalType.Create) {
            setCurrentTask({
                id: 0,
                name: "",
                description: "",
                dueDate: new Date(),
                status: "Planned"
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
                updateTaskMutation.mutate(currentTask)
            } else if (modalType === ModalType.Create) {
                addTaskMutation.mutate(currentTask);
            }
        }
        closeModal();
    };

    const deleteTask = () => {
        if (currentTask) {
            deleteTaskMutation.mutate(currentTask.id);
        }
        closeModal();
    };

    const onStatusChange = (id: number, newStatus: string) => {
        const updatedTask = tasks.find((task) => task.id === id);
        if (updatedTask) {
            updateTaskMutation.mutate({ ...updatedTask, status: newStatus });
        }
    };

    if (isLoading) return <div>Loading tasks...</div>;
    if (isError) return <div>Error loading tasks</div>;

    return (
        <div style={{flex: 1}}>
            <TaskList
                tasks={tasks || []}
                header={
                    <Button
                        icon={<PlusCircleOutlined/>}
                        onClick={() => openModal(ModalType.Create)}
                    >
                        Create
                    </Button>
                }
                onEdit={(id) => openModal(ModalType.Edit, tasks.find((task) => task.id === id)!)}
                onDelete={(id) => openModal(ModalType.Delete, tasks.find((task) => task.id === id)!)}
                onStatusChange={onStatusChange}
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
