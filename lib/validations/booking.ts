import { z } from "zod";

export const bookingRequestSchema = z
  .object({
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    guests: z.coerce.number().int().min(1).max(8),
    guestName: z.string().min(2).max(80).optional(),
    email: z.email().optional(),
    phone: z.string().min(6).max(32).optional(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
