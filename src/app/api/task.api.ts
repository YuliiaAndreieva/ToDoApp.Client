import {Task} from "../../models/task.model";
import httpClient from "./httpClient";

const TaskApi = {
    getAllTasks: async (): Promise<Task[]> => {
        const response = await httpClient.get("/UserTask");
        return response.data;
    },

    addTask: async (task: Task): Promise<Task> => {
        const response = await httpClient.post("/UserTask", task);
        return response.data;
    },

    updateTask: async (updatedTask: Task): Promise<Task> => {
        const response = await httpClient.put("/UserTask", updatedTask);
        return response.data;
    },

    deleteTask: async (id: number): Promise<void> => {
        await httpClient.delete(`/UserTask/${id}`);
    },
};

export default TaskApi;
