import { z } from "zod";

const envSchema = z.object({
  VITE_AUTH_SERVER_URL: z.url(),
  VITE_CLIENT_ID: z.string(),
  VITE_API_URL: z.url(),
});

export const env = envSchema.parse(import.meta.env);
