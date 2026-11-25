'use client';

import { ChangeEvent, useOptimistic, useState, useTransition } from 'react';
import { Checkbox, CollapsibleGroup, Input, Modal } from '@/shared/ui';
import { BillTile, BillsSummary, getDateTitle, type Bill } from '@/entities/bills';
import { updateBill } from '@/features/billEdit';

interface MonthBillsGroupProps {
  monthKey: string;
  bills: Bill[];
  defaultOpen?: boolean;
}

export const MonthBillsGroup = ({
  monthKey,
  bills,
  defaultOpen = false,
}: MonthBillsGroupProps) => {
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [optBills, addOptBillsUpdate] = useOptimistic(
    bills,
    (currentBills, { billId, patch }: { billId: string, patch: Partial<Pick<Bill, "amount" | "isPaid">> }) => {
      return currentBills.map((b) => (b.id === billId ? { ...b, ...patch } : b))
    }
  )
  const selectedBill = optBills.find(b => b.id === selectedBillId) ?? null;
  const paidCount = optBills.filter(b => b.isPaid).length;

  const handleBillChange = async (
    billId: string,
    patch: Partial<Pick<Bill, 'amount' | 'isPaid'>>
  ) => {
    startTransition(async () => {
      addOptBillsUpdate({ billId, patch });
      await updateBill(monthKey, billId, patch);
    })
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!selectedBill) return;
    return handleBillChange(selectedBill?.id, { amount: Number(e.target.value) });
  }

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!selectedBill) return;
    return handleBillChange(selectedBill?.id, { isPaid: e.target.checked });
  }

  return (
    <>
      <CollapsibleGroup
        title={getDateTitle(monthKey)}
        paidCount={paidCount}
        totalCount={optBills.length}
        defaultOpen={defaultOpen}
      >
        <div className="flex flex-wrap gap-3">
          {optBills.map((bill) => (
            <BillTile
              key={bill.id}
              bill={bill}
              onClick={(clickedBill) => setSelectedBillId(clickedBill.id)}
            />
          ))}
        </div>
        <BillsSummary bills={optBills} />
      </CollapsibleGroup>
      <Modal
        isOpen={Boolean(selectedBill)}
        onClose={() => setSelectedBillId(null)}
        className="w-[95vw] max-w-4xl"
      >
        {selectedBill && (
          <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-100 overflow-hidden shadow-2xl">
            <div className="h-[60vh] bg-zinc-950/60 flex items-center justify-center border-b border-zinc-800">
              {selectedBill.url?.toLowerCase().endsWith('.pdf') ? (
                <span className="text-sm text-zinc-400">
                  [Здесь будет PDF с зумом: {selectedBill.url}]
                </span>
              ) : (
                <div className="text-center p-6">
                  <div className="text-lg font-medium text-zinc-300">
                    {selectedBill.name}
                  </div>
                  {selectedBill.url && (
                    <a
                      href={selectedBill.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline mt-2 inline-block"
                    >
                      {selectedBill.url}
                    </a>
                  )}
                </div>
              )}
            </div>

            {selectedBill.description && (
              <div className="px-5 py-3 text-sm text-zinc-400 border-b border-zinc-800 bg-zinc-900/40">
                {selectedBill.description}
              </div>
            )}

            <div className="px-5 py-4 flex items-center justify-between gap-4 bg-zinc-900">
              <span className="text-xs text-zinc-500">
                <Input key={selectedBill.id} label='Amount' defaultValue={selectedBill.amount} onBlur={handleInputChange} />
                <Checkbox label='Paid' checked={selectedBill.isPaid} onChange={handleCheckboxChange} />
              </span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
