import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8), // Validasi panjang password
});

type LoginSchema = z.infer<typeof loginSchema>;

export { loginSchema, type LoginSchema };
