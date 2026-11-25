'use server';

import z from "zod";
import { BillsDefaulConfig, BillsDefaultForm, settingsSchema } from "@/entities/bills";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/shared/config";
import { billsConfigFile } from "@/entities/bills/server";

type ErrorsActionState = Partial<Record<keyof BillsDefaultForm, string[]>>;
type FieldsActionState = Partial<Record<keyof BillsDefaultForm, string>>;
export type ActionState = {
  success: boolean;
  message: string;
  errors?: ErrorsActionState;
  fields?: FieldsActionState;
}

export async function saveDefaultBill(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = settingsSchema.safeParse(rawData);
  const fields: FieldsActionState = {
    name: formData.get("name")?.toString() ?? "",
    amount: formData.get("amount")?.toString() ?? "",
    url: formData.get("url")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    isPaid: formData.get("isPaid")?.toString() ?? "",
  }

  if (!parsed.success) {
    return {
      success: false,
      message: "Action failed",
      errors: z.flattenError(parsed.error).fieldErrors,
      fields
    };
  }

  try {
    const config: BillsDefaulConfig = (await billsConfigFile.read()) ?? [];
    const isEdit = Boolean(parsed.data.id);
    const itemToSave = {
      ...parsed.data,
      id: parsed.data.id || crypto.randomUUID(),
    };

    const existingIndex = config.findIndex((item) => item.id === itemToSave.id);

    if (existingIndex === -1) {
      config.push(itemToSave);
    } else {
      config[existingIndex] = itemToSave;
    }

    await billsConfigFile.save(config);
    revalidatePath(ROUTES.SETTINGS)

    return {
      success: true,
      message: isEdit ? "Bill update" : "Bill added",
    }

  } catch (e) {
    return {
      success: false,
      message: `Action error: ${e}`,
      fields
    };
  }

}

export async function deleteDefaultBill(id: string): Promise<ActionState> {
  if (!id) return { success: false, message: "'id' needed" };

  try {
    const config: BillsDefaulConfig = (await billsConfigFile.read()) ?? [];
    const updatedConfig = config.filter((item) => item.id !== id);

    await billsConfigFile.save(updatedConfig)
    revalidatePath(ROUTES.SETTINGS)

    return { success: true, message: 'Bill deleted' };
  } catch (e) {
    return {
      success: false,
      message: `Delete error: ${e}`,
    }
  }
}
