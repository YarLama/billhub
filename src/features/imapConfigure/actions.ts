'use server';

import { IMAP_PASS_HIDE_STRING, ImapConfig, imapConfigFile, settingsSchema } from "@/entities/imap";
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
    masterPassword: formData.get("masterPassword")?.toString() ?? "",
  }

  if (!parsed.success) {
    return {
      success: false,
      message: "Actions failed",
      errors: z.flattenError(parsed.error).fieldErrors,
      fields
    };
  }

  try {
    const existingConfig = await imapConfigFile.read();
    const { password, masterPassword, ...restData } = parsed.data;
    let finalDek, finalPassword;
    const isPasswordChanged = !existingConfig || password !== IMAP_PASS_HIDE_STRING;

    if (isPasswordChanged) {
      if (!masterPassword?.trim()) {
        return {
          success: false,
          message: "Master password needed",
          errors: { masterPassword: ["Enter Master password"] },
          fields
        }
      }
      const newDek = generateRandomDek();
      finalDek = await encryptDekWithMaster(newDek, masterPassword);
      finalPassword = await encryptPassword(password, newDek);
    } else {
      finalDek = existingConfig.dek;
      finalPassword = existingConfig.password;
    }

    const data: ImapConfig = {
      ...restData,
      password: finalPassword,
      dek: finalDek
    }
    await imapConfigFile.save(data);
    return {
      success: true,
      message: "Actions success",
      fields: {
        ...fields,
        password: IMAP_PASS_HIDE_STRING,
        masterPassword: ""
      }
    }
  } catch (e) {
    return {
      success: false,
      message: `Actions error: ${e}`,
      fields
    }
  }
}
