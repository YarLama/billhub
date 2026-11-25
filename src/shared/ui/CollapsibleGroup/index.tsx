'use client';

import { ReactNode, useState } from "react";
import { Button } from "../Button";

interface CollapsibleGroupProps {
  title: string;
  paidCount: number;
  totalCount: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const CollapsibleGroup = ({ title, paidCount, totalCount, defaultOpen = false, children }: CollapsibleGroupProps) => {

  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const getBorderColor = () => {
    if (totalCount === 0 || paidCount === 0) return 'border-l-rose-500';
    if (paidCount >= totalCount) return 'border-l-emerald-500';
    return 'border-l-amber-500';
  }

  return (
    <div className={`rounded-xl border border-zinc-800 border-l-8 ${getBorderColor()} bg-zinc-900/60 overflow-hidden transition-colors`}>
      <Button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-zinc-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-zinc-100">{title}</span>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full border">
            {paidCount}/{totalCount}
          </span>
          <span className={`text-zinc-400 text-xs transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
            ▶
          </span>
        </div>
      </Button>
      {isOpen && (
        <div className="border-t border-zinc-800/80 p-4 bg-zinc-950/30">
          {children}
        </div>
      )}
    </div>
  )
}
