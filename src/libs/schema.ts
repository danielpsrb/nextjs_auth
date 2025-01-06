import { z } from 'zod';

const schema = z.object({
        username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, atau garis bawah"),
        email: z.string().email(),
        password: z.string()
            .min(6)
            .regex(/[A-Z]/, "Password harus mengandung huruf besar")
            .regex(/[a-z]/, "Password harus mengandung huruf kecil")
            .regex(/[0-9]/, "Password harus mengandung angka")
            .regex(/[\W_]/, "Password harus mengandung simbol"),
        confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password harus cocok",
    path: ["confirmPassword"], // Menandai field yang salah
});

type Schema = z.infer<typeof schema>;

export { schema, type Schema };