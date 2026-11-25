import type { Bill } from '../models/types';

interface BillsSummaryProps {
  bills: Bill[];
}

export const BillsSummary = ({ bills }: BillsSummaryProps) => {
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-sm">
      <span className="text-zinc-400">Summary:</span>
      <span className="font-semibold text-zinc-100">
        {totalAmount.toLocaleString('ru-RU')} ₽
      </span>
    </div>
  );
};
