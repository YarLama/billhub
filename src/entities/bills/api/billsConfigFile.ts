import { serverStorage } from "@/shared/lib/storage";
import { BillsDefaultForm } from "../models/settingsSchema";

const BILLS_DEFAULTS_CONFIG_FILENAME = "bills_default.json";

export type BillsDefaulConfig = BillsDefaultForm[];
export type BillsDefaulItem = BillsDefaultForm;

export const billsConfigFile = {
  save: async function(data: BillsDefaulConfig) {
    await serverStorage.saveJson(BILLS_DEFAULTS_CONFIG_FILENAME, data);
  },
  read: async function(): Promise<BillsDefaulConfig | null> {
    const data = await serverStorage.readJson<BillsDefaulConfig>(BILLS_DEFAULTS_CONFIG_FILENAME);
    return data;
  }
}
