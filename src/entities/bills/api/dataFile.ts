import { serverStorage } from "@/shared/lib/storage";
import { BillsData } from "../models/types";

const BILLS_DATA_FILENAME = "data.json";

export const billsDataFile = {
  save: async function(data: BillsData) {
    await serverStorage.saveJson(BILLS_DATA_FILENAME, data);
  },
  read: async function(): Promise<BillsData | null> {
    const data = await serverStorage.readJson<BillsData>(BILLS_DATA_FILENAME)
    return data;
  }
}
