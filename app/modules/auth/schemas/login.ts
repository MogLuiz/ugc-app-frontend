import { z } from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .regex(EMAIL_REGEX, "E-mail inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginForm = z.infer<typeof loginSchema>;
