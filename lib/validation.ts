import {z} from "zod";

export const courseSchema = z.object({
    name: z.string().min(3, "Course name must be atleast 3 characters"),
    description: z.string().min(3, "Description  must be atleast 10 characters"),
    joinCode: z.string().transform((s) => s.toUpperCase().trim()).refine((s) => /^[A-Z]{3}[0-9]{4}$/.test(s), {
      message: "Join code must be 3 letters followed by 4 digits (e.g. ABC1234).",
    }),
})

export const testCaseSchema = z.object({
  input: z.string().min(1, { message: "input cannot be empty" }),
  expectedOutput: z.string().min(1, { message: "expectedOutput cannot be empty" }),
  isHidden: z.boolean().optional().default(false),
});

export const problemSchema = z.object({
  title: z.string().min(3, "Title must be atleast 3 characters"),
  description: z.string().min(10, "Description must be atleast 10 characters"),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    errorMap: () => ({ message: "Difficulty must be one of 'Easy', 'Medium', or 'Hard'" }),
  }),
  tags: z.array(z.string()).optional(),
  timeLimit: z.coerce.number().min(1, "Time limit must be at least 1 second").max(10, "Time limit cannot exceed 10 seconds"),
  memoryLimit: z.coerce.number().min(32, "Memory limit must be at least 32 MB").max(1024, "Memory limit cannot exceed 1024 MB"),
  constraints: z.array(z.string()).optional(),
  categoryId: z.string().min(3, "Category must be atleast 3 characters"),
  teacherSolution: z.string().min(10, "Teacher solution must be atleast 10 characters"),
  teacherSolutionLanguageId: z.coerce.number(),
  testCases: z.array(testCaseSchema).min(1, { message: "At least one test case required" }),
})


export const categorySchema = z.object({
  name: z.string().min(3).max(100),
});

export const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be atleast 3 characters"),
  description: z.string().min(10, "Description must be atleast 10 characters"),
  courseId: z.string().min(3, "Course ID must be valid"),
  selectedProblems: z.array(z.string().min(3)).min(1, "Atleast one problem must be selected"),
  dueDate: z.coerce.date().min(new Date(), "Due date must be in the future"),
  maxAttempts: z
  .coerce.number()
  .min(1, "Max attempts must be at least 1")
  .default(1000)
  .optional()
});

export type CourseSchema = z.infer<typeof courseSchema>;