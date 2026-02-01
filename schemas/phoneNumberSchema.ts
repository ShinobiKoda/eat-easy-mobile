import { z } from 'zod';

export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long")
    // Regex for basic international format (optional + followed by digits)
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;