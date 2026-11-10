'use server';

import { settingsSchema } from "@/entities/imap";
import z from "zod";

export async function saveImap(prevState, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = settingsSchema.safeParse(rawData);
  console.log(`rawData: ${rawData}`);
  console.log(`parsed: ${parsed}`);

  if (!parsed.success) {
    return {
      success: false,
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    console.log(`SaveImap actions`);
    return {
      success: true,
      message: "Actions success"
    }
  } catch (e) {
    return {
      success: false,
      message: "Actions error"
    }
  }
}
