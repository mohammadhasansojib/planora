import * as z from "zod";


export const CreateOrgSchema = z.object({
    name: z.string().min(3, "organization name must be atleat 3 characters"),
});

export const AddMemberSchema = z.object({
    organizationId: z.uuid({
        error: "Invalid organization Id"
    }),
    userId: z.uuid({
        error: "Invalid user Id"
    }),
});