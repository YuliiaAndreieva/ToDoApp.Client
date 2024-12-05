import {Task} from "../../models/task.model";
import httpClient from "./httpClient";

const TaskApi = {
    getAllTasks: async (): Promise<Task[]> => {
        const response = await httpClient.get("/task");
        return response.data;
    },

    addTask: async (task: Task): Promise<Task> => {
        const response = await httpClient.post("/task", task);
        return response.data;
    },

    updateTask: async (updatedTask: Task): Promise<Task> => {
        const response = await httpClient.put("/task", updatedTask);
        return response.data;
    },

    deleteTask: async (id: number): Promise<void> => {
        await httpClient.delete(`/task/${id}`);
    },
};

export default TaskApi;
