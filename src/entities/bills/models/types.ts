import { BillsDefaultForm } from "./settingsSchema";

export type BillsDefaulConfig = BillsDefaultForm[];
export type BillsDefaulItem = BillsDefaultForm;
export type Bill = Omit<BillsDefaulItem, "id"> & {
  id: string
};
export type BillsData = Record<string, Bill[]>;
