import 'server-only';
import { EmptyBills } from './EmptyBills';

export function BillsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Счета и квитанции</h1>
      </header>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
        <EmptyBills />
      </div>
    </div>
  );
}

