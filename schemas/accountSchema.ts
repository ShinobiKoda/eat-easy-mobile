import { z } from "zod";

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),
});

export type UsernameFormData = z.infer<typeof usernameSchema>;

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(254, "Email is too long"),
});

export type EmailFormData = z.infer<typeof emailSchema>;

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export type PasswordFormData = z.infer<typeof passwordSchema>;

export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;

export const accountSchema = z.object({
  username: usernameSchema.shape.username,
  email: emailSchema.shape.email,
  password: passwordSchema.shape.password,
  phoneNumber: phoneSchema.shape.phoneNumber,
});

export type AccountFormData = z.infer<typeof accountSchema>;
