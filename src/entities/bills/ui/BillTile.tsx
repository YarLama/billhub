import { Button } from "@/shared/ui";
import { Bill } from "../models/types";

interface BillTileProps {
  bill: Bill;
  onClick: (bill: Bill) => void;
}

export const BillTile = ({ bill, onClick }: BillTileProps) => {
  const borderClass = bill.isPaid
    ? 'border-emerald-500 bg-emerald-950/20 hover:bg-emerald-950/40'
    : 'border-rose-500 bg-rose-950/20 hover:bg-rose-950/40';

  return (
    <Button type="button" onClick={() => onClick(bill)} title={bill.name} className={`w-14 h-14 rounded-xl border-2 ${borderClass} flex items-center justify-center cursor-pointer`} />
  )
}
