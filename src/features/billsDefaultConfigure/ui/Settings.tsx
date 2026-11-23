'use client';

import { BillsDefaulConfig, BillsDefaulItem } from "@/entities/bills";
import { Button, Modal } from "@/shared/ui"
import { use, useState } from "react";
import { SettingsForm } from "./SettingsForm";

interface SettingsProps {
  billsDefaultConfig: Promise<BillsDefaulConfig | null>;
}

export const Settings = ({ billsDefaultConfig: billsConfigPromise }: SettingsProps) => {
  const billsDefaultConfig = use(billsConfigPromise);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentBill, setCurrentBill] = useState<BillsDefaulItem | undefined>();

  const handleAddClick = () => {
    setCurrentBill(undefined);
    setIsOpen(true);
  }

  const handleEditClick = (item: BillsDefaulItem) => {
    setCurrentBill(item);
    setIsOpen(true);
  }

  const handleClose = () => {
    setCurrentBill(undefined);
    setIsOpen(false);
  }

  return (
    <div>
      <h1>Default Bills</h1>
      {billsDefaultConfig?.map((item) => {
        return (
          <div key={item.id} onClick={() => handleEditClick(item)}>
            {item.name}
          </div>
        )
      })}
      <Button label="+" onClick={handleAddClick} />
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="bg-white p-2">
          <SettingsForm key={currentBill?.id ?? "new"} item={currentBill} onSuccess={handleClose} />
        </div>
      </Modal>
    </div>
  )
}
