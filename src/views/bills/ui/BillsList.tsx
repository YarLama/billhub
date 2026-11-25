import type { BillsData } from "@/entities/bills";
import { EmptyBills } from "./EmptyBills";
import { MonthBillsGroup } from "@/widgets/monthBillsGroup";
import { use } from "react";

interface BillsListProps {
  dataPromise: Promise<BillsData | null>;
}

export function BillsList({ dataPromise }: BillsListProps) {
  const data = use(dataPromise);
  const monthKeys = data ? Object.keys(data).sort().reverse() : [];

  if (!data || monthKeys.length === 0) return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
      <EmptyBills />
    </div>
  )

  return (
    <div className="space-y-4">
      {monthKeys.map((monthKey, index) => (
        <MonthBillsGroup
          key={monthKey}
          monthKey={monthKey}
          bills={data![monthKey]}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  )
}
