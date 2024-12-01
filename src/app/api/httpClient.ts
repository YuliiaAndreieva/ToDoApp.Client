import axios from "axios";
import {errorLogger, requestLogger, responseLogger} from "axios-logger";

const httpClient = axios.create({
    baseURL: "http://localhost:5145/api",
    headers: {
        "Content-Type": "application/json",
    },
})

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

httpClient.interceptors.request.use(requestLogger);
httpClient.interceptors.response.use(responseLogger, errorLogger);

export default httpClient;