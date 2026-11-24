'use client';

import { imapUpdateDataAction } from "@/features/imapDataUpdate";
import { MasterPassModal } from "@/shared/ui";
import { useState, useTransition } from "react";

export const RefreshDataButton = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleUpdateClick = () => {
    startTransition(async () => {
      const res = await imapUpdateDataAction({ cache: true });

      if (res.status === 'NEED_PASSWORD') {
        setIsOpen(true);
        return;
      }
      if (res.status === "ERROR") {
        console.log('Error IMAP:', res.message)
        return;
      }
    })
  }

  const handleUpdateConfirm = async (masterPassword?: string) => {
    const res = await imapUpdateDataAction({ masterPassword, cache: true });

    if (res.status === 'INVALID_PASSWORD') {
      setError("Invalid Master password");
      return false;
    }

    if (res.status === "ERROR") {
      console.log('Error IMAP:', res.message)
      return true;
    }

    setError("");
    return true;
  }
  return (
    <div>
      <button
        onClick={() => handleUpdateClick()}
        className="p-3 rounded-xl text-xl text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 transition-all duration-200 active:scale-95"
        title="Обновить данные"
        type="button"
      >
        {isPending ? '⏳' : '🔄'}
      </button>
      <MasterPassModal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={(p) => handleUpdateConfirm(p)} errorMessage={error} />
    </div>
  )
}
