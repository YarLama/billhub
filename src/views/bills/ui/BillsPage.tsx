import 'server-only';
import { BillsList } from './BillsList';
import { billsDataFile } from '@/entities/bills/server';
import { Suspense } from 'react';

export async function BillsPage() {

  const data = billsDataFile.read();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Счета и квитанции</h1>
      </header>
      <Suspense fallback={<div>Bills loading...</div>}>
        <BillsList dataPromise={data} />
      </Suspense>
    </div>
  );
}

