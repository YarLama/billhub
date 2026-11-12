'use server';

import { ImapConfig, imapConfigFile, settingsSchema } from "@/entities/imap";
import { ImapForm } from "@/entities/imap/models/settingsSchema";
import { encryptDekWithMaster, encryptPassword, generateRandomDek } from "@/shared/lib/crypto";
import z from "zod";

type ErrorsActionState = Partial<Record<keyof ImapForm, string[]>>;
type FieldsActionState = Partial<Record<keyof ImapForm, string>>;

export type ActionState = {
  success: boolean;
  message: string;
  errors?: ErrorsActionState;
  fields?: FieldsActionState;
}

export async function saveImap(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = settingsSchema.safeParse(rawData);
  const fields = {
    host: formData.get("host")?.toString() ?? "",
    port: formData.get("port")?.toString() ?? "",
    user: formData.get("user")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  }
  console.log(`rawData: `, rawData);
  console.log(`parsed: `, parsed);

  if (!parsed.success) {
    return {
      success: false,
      message: "Actions failed",
      errors: z.flattenError(parsed.error).fieldErrors,
      fields
    };
  }

  try {
    console.log(`SaveImap actions`, parsed.data);
    const testMasterPass = "1234";
    const password = parsed.data.password;
    const newDek = generateRandomDek();
    const eDek = await encryptDekWithMaster(newDek, testMasterPass);
    const ePassword = await encryptPassword(password, newDek);
    const data: ImapConfig = {
      ...parsed.data,
      password: ePassword,
      dek: eDek
    }
    await imapConfigFile.save(data);
    return {
      success: true,
      message: "Actions success",
      fields
    }
  } catch (e) {
    return {
      success: false,
      message: "Actions error",
      fields
    }
  }
}
