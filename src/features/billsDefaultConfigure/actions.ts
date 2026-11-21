'use server';

import z from "zod";
import { billsConfigFile, BillsDefaulConfig, billsDefaultForm, settingsSchema } from "@/entities/bills";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/shared/config";

type ErrorsActionState = Partial<Record<keyof billsDefaultForm, string[]>>;
type FieldsActionState = Partial<Record<keyof billsDefaultForm, string>>;
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
    const { defaults }: BillsDefaulConfig = (await billsConfigFile.read()) ?? { defaults: [] };
    const isEdit = Boolean(parsed.data.id);
    const itemToSave = {
      ...parsed.data,
      id: parsed.data.id || crypto.randomUUID(),
    };

    if (isEdit) {
      const existingIndex = defaults.findIndex((item) => item.id === itemToSave.id);
      if (existingIndex === -1) {
        defaults[existingIndex] = itemToSave;
      } else defaults.push(itemToSave);
    } else {
      defaults.push(itemToSave);
    }

    await billsConfigFile.save({ defaults });
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
    const { defaults }: BillsDefaulConfig = (await billsConfigFile.read()) ?? { defaults: [] };
    const updatedDefaults = defaults.filter((item) => item.id !== id);

    await billsConfigFile.save({ defaults: updatedDefaults })
    revalidatePath(ROUTES.SETTINGS)

    return { success: true, message: 'Bill deleted' };
  } catch (e) {
    return {
      success: false,
      message: `Delete error: ${e}`,
    }
  }
}
