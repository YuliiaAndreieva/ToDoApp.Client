import { RuleObject } from "antd/es/form";
import dayjs, {Dayjs} from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const startOfWeek = dayjs().startOf("isoWeek");
const endOfWeek = startOfWeek.add(7, "days");

export const nameValidator = [
    { required: true, message: "Please enter the task name" },
    { max: 20, message: "Task name cannot exceed 50 characters" },
    { min: 3, message: "Task name cannot be less then 3 characters" },
];

export const descriptionValidator = [
    { max: 50, message: "Description cannot exceed 200 characters" },
    { min: 3, message: "Description name cannot be less then 3 characters" },
];

export const dueDateValidator = [
    { required: true, message: "Please select a due date" },
    {
        validator: (_: RuleObject, value: Dayjs) => {
            if (!value) {
                return Promise.reject("Please select a due date");
            }
            if (value.isBefore(startOfWeek) || value.isAfter(endOfWeek)) {
                return Promise.reject(
                    `Please select a date between ${startOfWeek.format(
                        "YYYY-MM-DD"
                    )} and ${endOfWeek.format("YYYY-MM-DD")}`
                );
            }
            return Promise.resolve();
        },
    },
];

