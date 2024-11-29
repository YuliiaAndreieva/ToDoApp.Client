import {Task} from "../../models/task.model";

const TaskApi = {
    tasks: [
        {
            dueDate: new Date('2024-11-30T16:45:00'),
            description: 'Test Description',
            id: 1,
            isDone: true,
            name: 'Test Task 1'
        },
        {
            id: 2,
            name: 'Test Task 2',
            description: 'Test Description',
            dueDate: new Date('2024-11-30'),
            isDone: false
        },
    ] as Task[],

    getAllTasks(): Task[] {
        return this.tasks;
    },

    addTask(newTask: Task): void {
        this.tasks.push(newTask);
    },

    updateTask(updatedTask: Task): void {
        this.tasks = this.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
        );
    },

    deleteTask(taskId: number): void {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
    },
};

export default TaskApi;
