'use client';
import { ComponentProps, KeyboardEvent, useRef } from "react"
import { Button } from "../Button"
import { Input } from "../Input"
import { Modal } from "../Modal"


interface MasterPassModalProps extends ComponentProps<typeof Modal> {
  onConfirm: (password: string) => void | Promise<void>
  clearOnConfirm?: boolean;
  clearOnClose?: boolean;
}

export const MasterPassModal = ({ onConfirm, onClose, clearOnConfirm = true, clearOnClose = true, ...props }: MasterPassModalProps) => {

  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!password) return;

    await onConfirm(password);
    if (clearOnConfirm) clearInput();
    onClose();
  }

  const handleClose = () => {
    if (clearOnClose) clearInput();
    onClose();
  }

  return (
    <Modal {...props} onClose={handleClose}>
      <div className="bg-gray-500 p-6 rounded-3xl">
        <header><h3>Enter Master Password</h3></header>
        <Input ref={inputRef} type="password" name="masterPassword" onKeyDown={handleKeyDown} />
        <Button label="Confirm" onClick={handleConfirm} type="button" />
      </div>
    </Modal>
  )
}
