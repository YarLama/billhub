"use client";

import { BillsDefaulItem } from "@/entities/bills"
import { ActionState, deleteDefaultBill, saveDefaultBill } from "../actions";
import { useActionState, useEffect, useState, useTransition } from "react";
import { Button, Input } from "@/shared/ui";

interface SettingsFormProps {
  item?: BillsDefaulItem;
  onSuccess?: () => void;
}

const createInitialState = (item?: BillsDefaulItem): ActionState => ({
  success: false,
  errors: {},
  message: "",
  fields: {
    id: item?.id ?? "",
    name: item?.name ?? "",
    amount: item?.amount !== undefined ? String(item.amount) : "0",
    url: item?.url ?? "",
    description: item?.description ?? "",
    isPaid: String(item?.isPaid) ?? false,
  }
})

export const SettingsForm = ({ item, onSuccess }: SettingsFormProps) => {
  const initialState = createInitialState(item);
  const [state, formAction, isPending] = useActionState(saveDefaultBill, initialState);
  const [error, setError] = useState<string>("");
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDelete = () => {
    if (!item?.id) return;
    if (!confirm(`Delete ${item?.name}?`)) return;

    startDeleteTransition(async () => {
      const res = await deleteDefaultBill(item?.id ?? "");
      if (res.success) onSuccess?.()
      else setError(res.message);
    })
  }

  const isBusy = isPending || isDeleting;

  useEffect(() => {
    if (state.success) onSuccess?.();
  }, [state.success, onSuccess])

  return (
    <div>
      <h2>{item?.id ? `Edit ${item.name}` : "New default bill"}</h2>
      <form action={formAction}>
        <div>
          {item?.id && <Input name="id" type="hidden" value={item.id} />}
          <Input label="name" defaultValue={state.fields?.name} name="name" error={state.errors?.name?.[0]} required />
          <Input label="amount" defaultValue={state.fields?.amount} name="amount" error={state.errors?.amount?.[0]} />
          <Input label="url" defaultValue={state.fields?.url} name="url" error={state.errors?.url?.[0]} />
          <Input label="description" defaultValue={state.fields?.description} name="description" error={state.errors?.description?.[0]} />
          {error && <div>{error}</div>}
        </div>
        <div>
          <Button label={item?.id ? "Edit" : "Add"} type="submit" disabled={isBusy} />
          {item?.id && <Button label="Delete" onClick={handleDelete} type="button" disabled={isBusy} />}
        </div>
      </form>
    </div>
  )
}
