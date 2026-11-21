import z from "zod";

export const settingsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  amount: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number("Enter number").nonnegative("Amount should be positive")
  ),
  url: z
  .url("Uncorrect URL")
  .optional()
  .or(z.literal(""))
  .transform((val) => (val === "" ? undefined : val)),

  description: z
  .string()
  .optional()
  .transform((val) => (val === "" ? undefined : val)),
  isPaid: z.boolean().default(false),
})

export type BillsDefaultForm = z.infer<typeof settingsSchema>;
