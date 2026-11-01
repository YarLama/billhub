import 'server-only';

export function SettingsPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Настройки</h1>
        <p className="text-slate-500 mt-1">Конфигурация хранилища, параметры безопасности и подключение к почтовому серверу.</p>
      </header>
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Интеграция IMAP</h3>
          <p className="text-sm text-slate-400">Форма настройки подключения будет размещена здесь.</p>
        </div>
      </div>
    </div>
  );
}

