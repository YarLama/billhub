'use server';

import { billsDataFile } from '@/entities/bills/server';
import type { Bill } from '@/entities/bills';
import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/shared/config';

export async function updateBill(
  monthKey: string,
  billId: string,
  patch: Partial<Pick<Bill, 'amount' | 'isPaid'>>
) {
  const data = await billsDataFile.read();
  if (!data || !data[monthKey]) return;

  data[monthKey] = data[monthKey].map((bill) =>
    bill.id === billId ? { ...bill, ...patch } : bill
  );

  await billsDataFile.save(data);
  revalidatePath(ROUTES.HOME);
}
