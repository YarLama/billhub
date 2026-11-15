'use client';
import { ComponentProps, KeyboardEvent, useRef, useState } from "react"
import { Button } from "../Button"
import { Input } from "../Input"
import { Modal } from "../Modal"


interface MasterPassModalProps extends ComponentProps<typeof Modal> {
  onConfirm: (password: string) => boolean | Promise<boolean>
  clearOnConfirm?: boolean;
  clearOnClose?: boolean;
  errorMessage?: string;
}

export const MasterPassModal = ({ onConfirm, onClose, clearOnConfirm = true, clearOnClose = true, errorMessage, ...props }: MasterPassModalProps) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  }

  const handleConfirm = async () => {
    const password = inputRef.current?.value;
    if (!password || isLoading) return;
    setIsLoading(true);
    try {
      const res = await onConfirm(password);
      if (res === false) {
        inputRef.current?.focus()
        return;
      }
      if (clearOnConfirm) clearInput();
      onClose();
    } finally {
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    if (clearOnClose) clearInput();
    onClose();
  }

  return (
    <Modal {...props} onClose={handleClose}>
      <div className="bg-gray-500 p-6 rounded-3xl">
        <header><h3>Enter Master Password</h3></header>
        <Input ref={inputRef} type="password" name="masterPassword" onKeyDown={handleKeyDown} error={errorMessage} />
        <Button label="Confirm" onClick={handleConfirm} type="button" />
      </div>
    </Modal>
  )
}
