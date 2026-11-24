import { Bill, BillsDefaulItem } from "../models/types";

export function mergeBills(
  existingBills: Bill[] | undefined,
  defaultBills: BillsDefaulItem[],
  fetchedBills: Bill[]
): Bill[] {
  const baseBills: Bill[] = existingBills ?? defaultBills.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
  }));

  if (fetchedBills.length === 0) return baseBills;

  const existingKeys = new Set(baseBills.map((b) => b.url ?? b.name));

  const newImapBills: Bill[] = fetchedBills
    .filter((item) => {
      const key = item.url ?? item.name;
      return !existingKeys.has(key);
    })
    .map((item) => ({
      ...item,
      id: item.id || crypto.randomUUID(),
    }));

  return [...baseBills, ...newImapBills];
}
