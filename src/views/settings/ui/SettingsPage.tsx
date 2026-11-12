import { imapConfigFile } from '@/entities/imap';
import { ImapSettings } from '@/features/imapConfigure';
import { Suspense } from 'react';
import 'server-only';

export async function SettingsPage() {

  const imapInitialData = imapConfigFile.readClient();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Настройки</h1>
        <p className="text-slate-500 mt-1">Конфигурация хранилища, параметры безопасности и подключение к почтовому серверу.</p>
      </header>

      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <Suspense fallback={<div>Loading...</div>}>
            <ImapSettings imapConfig={imapInitialData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

