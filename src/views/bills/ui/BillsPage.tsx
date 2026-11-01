import 'server-only';

export function BillsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Счета и квитанции</h1>
        <p className="text-slate-500 mt-1">Здесь отображаются документы, автоматически извлеченные из вашей почты IMAP.</p>
      </header>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
        <div className="text-4xl mb-4">📂</div>
        <h3 className="text-lg font-semibold text-slate-800">Список счетов пуст</h3>
        <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
          Подключите почту в настройках и нажмите кнопку «Обновить данные» в меню.
        </p>
      </div>
    </div>
  );
}

