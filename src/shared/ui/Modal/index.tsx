'use client';
import { ComponentProps, useEffect, useRef, MouseEvent } from "react";


interface ModalProps extends Omit<ComponentProps<'dialog'>, 'open' | 'onClose'> {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal = ({ isOpen = false, onClose, onClick, children, className, ...props }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleBackClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    };
    onClick?.(e);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackClick}
      className={`
        m-auto p-0 bg-transparent backdrop:bg-black/80 backdrop:backdrop-blur-xs
        ${className}`}
      {...props}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </dialog>
  )
}
