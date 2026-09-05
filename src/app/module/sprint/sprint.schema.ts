import * as z from "zod";

export const CreateSprintSchema = z.object({
    name: z.string().min(1, "Sprint name is required"),
    projectId: z.uuid({
        error: "Invalid project ID",
    }),
    startTime: z.coerce.date({
        error: "Invalid start date",
    }),
    endTime: z.coerce.date({
        error: "Invalid end date",
    }),
})
.refine((data) => data.startTime < data.endTime, {
    message:"Start Time must be before End Time",
});