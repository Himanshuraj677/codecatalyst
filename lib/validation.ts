import {z} from "zod";

export const courseSchema = z.object({
    name: z.string().min(3, "Course name must be atleast 3 characters"),
    description: z.string().min(3, "Description  must be atleast 10 characters"),
    joinCode: z.string().transform((s) => s.toUpperCase().trim()).refine((s) => /^[A-Z]{3}[0-9]{4}$/.test(s), {
      message: "Join code must be 3 letters followed by 4 digits (e.g. ABC1234).",
    }),
})



export type CourseSchema = z.infer<typeof courseSchema>;