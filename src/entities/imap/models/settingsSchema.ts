import z from "zod";

export const settingsSchema = z.object({
  host: z.hostname("Invalid IMAP host").min(1, "Host is required"),
  port: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.coerce
      .number({ error: "Port must be a number" })
      .int("Port must be an integer")
      .min(1, "Port must be at least 1")
      .max(65535, "Port must be at most 65535")
      .default(993)
  ),
  user: z.email("User mail must be correct").min(1, "User is required"),
  password: z.string().min(1, "Password is required"),
  masterPassword: z.string().optional().transform((val) => (val?.trim() ? val.trim() : undefined))
});

export type ImapForm = z.infer<typeof settingsSchema>;
