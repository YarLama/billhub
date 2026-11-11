import { imapConfigFile } from '@/entities/imap';
import { ImapSettings } from '@/features/imapConfigure';
import 'server-only';

const imapInitialData = await imapConfigFile.read();
console.log('imap.json: ', imapInitialData)

export async function SettingsPage() {

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Настройки</h1>
        <p className="text-slate-500 mt-1">Конфигурация хранилища, параметры безопасности и подключение к почтовому серверу.</p>
      </header>
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <ImapSettings />
        </div>
      </div>
    </div>
  );
}

