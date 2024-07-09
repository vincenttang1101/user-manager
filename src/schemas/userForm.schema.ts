import { avatarSchema } from "@/schemas/avatar.schema";
import { z } from "zod";

export const userFormSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["admin", "editor", "user"], {
      required_error: "Please select a role",
    }),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"),
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    avatar: avatarSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UserFormData = z.infer<typeof userFormSchema>;
