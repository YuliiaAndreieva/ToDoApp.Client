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

export const statusValidator = [
    { required: true, message: "Please select a task status" },
];

export const rangeDateValidator = [
    {
        validator: (_: RuleObject, value: [Dayjs, Dayjs]) => {
            if (!value || !value[0] || !value[1]) {
                return Promise.reject(new Error("Both Start Date and End Date are required."));
            }

            const [startDate, endDate] = value;

            if (startDate.isAfter(endDate)) {
                return Promise.reject(new Error("Start Date cannot be after End Date."));
            }

            if (startDate.isBefore(startOfWeek) || endDate.isAfter(endOfWeek)) {
                return Promise.reject(
                    new Error(
                        `Dates must be between ${startOfWeek.format("YYYY-MM-DD")} and ${endOfWeek.format(
                            "YYYY-MM-DD"
                        )}.`
                    )
                );
            }

            return Promise.resolve();
        },
    },
];

