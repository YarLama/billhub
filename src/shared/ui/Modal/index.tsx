'use client';
import { ComponentProps, useEffect, useRef, MouseEvent } from "react";


interface ModalProps extends Omit<ComponentProps<'dialog'>, 'open' | 'onClose'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const Modal = ({ isOpen = false, onClose, title, onClick, children, ...props }: ModalProps) => {
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
      title={title}
      {...props}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </dialog>
  )
}
