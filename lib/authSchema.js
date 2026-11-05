import { z } from "zod";
export const authSchema = z.object({
  action: z.enum(["signup", "signin"]),
  name: z.string().trim().max(60).optional(),
  email: z
    .email()
    .max(254)
    .transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8).max(72),
});
