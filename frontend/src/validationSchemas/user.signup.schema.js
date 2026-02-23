import { z } from "zod";

export const SignupSchema = z.object({
    name: z.string().min(3,"Should have atleast 3 characters").max(30, "Should not have more than 30 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must have 6 characters ")
});