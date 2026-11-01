"use client"; 

import Link from 'next/link';

export function Sidebar() {

  const handleRefresh = async () => {
    console.log("Клик по кнопке 'Обновить данные'. Здесь будет логика проверки Мастер-пароля и запуск IMAP.");
  };

  return (
    <aside className="w-16 h-screen bg-slate-900 text-white flex flex-col items-center py-6 justify-between border-r border-slate-800 select-none">
      <div className="flex flex-col gap-8 items-center w-full">
        <div className="font-black text-xs bg-slate-800 p-2 rounded-lg text-indigo-400 border border-slate-700">
          BH
        </div>
        <nav className="flex flex-col gap-4 w-full items-center px-2">
          <Link 
            href="/" 
            title="Счета"
          >
            💵
          </Link>
          <Link 
            href="/settings" 
            title="Настройки"
          >
            ⚙️
          </Link>
        </nav>
      </div>
      <div className="flex flex-col gap-4 items-center w-full px-3">
        <div className="w-full h-[1px] bg-slate-800" />
        <button
          onClick={handleRefresh}
          className="p-3 rounded-xl text-xl text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 transition-all duration-200 active:scale-95"
          title="Обновить данные"
          type="button"
        >
          🔄
        </button>
        <span className="text-[10px] text-slate-600 font-mono mt-2">v1.0</span>
      </div>
    </aside>
  );
}
