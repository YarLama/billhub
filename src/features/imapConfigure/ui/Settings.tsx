'use client';

import { Button, Input, MasterPassModal } from "@/shared/ui"
import { ActionState, saveImap } from "../actions";
import { SyntheticEvent, use, useActionState, useRef, useState } from "react";
import { type ImapConfig } from "@/entities/imap";

interface SettingsProps {
  imapConfig: Promise<ImapConfig | null>;
}

const createInitialState = (config: ImapConfig | null): ActionState => ({
  success: false,
  errors: {},
  message: "",
  fields: {
    host: config?.host ?? "",
    port: config?.port ? String(config.port) : "",
    user: config?.user ?? "",
    password: config?.password ?? "",
    masterPassword: ""
  }
})

export const Settings = ({ imapConfig: imapConfigPromise }: SettingsProps) => {
  const imapConfig = use(imapConfigPromise)
  const initialState = createInitialState(imapConfig);
  const [state, formAction, isPending] = useActionState(saveImap, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("password")?.toString() ?? "";
    const masterPassword = formData.get("masterPassword")?.toString() ?? "";
    const isPasswordChanged = !imapConfig || currentPassword !== initialState.fields?.password;

    if (isPasswordChanged && !masterPassword.trim()) {
      e.preventDefault();
      setIsOpen(true);
    }
  }

  const handleConfirm = () => {
    formRef.current?.requestSubmit();
  }

  return (
    <div>
      <h1>IMAP Settings</h1>
      <form action={formAction} ref={formRef} onSubmit={handleSubmit}>
        <Input label="host" defaultValue={state.fields?.host} name="host" error={state.errors?.host?.[0]} required/>
        <Input label="port" defaultValue={state.fields?.port} error={state.errors?.port?.[0]} name="port" type="number" required/>
        <Input label="user" defaultValue={state.fields?.user} error={state.errors?.user?.[0]} name="user" type="email" required/>
        <Input label="password" defaultValue={state.fields?.password} error={state.errors?.password?.[0]} name="password" type="password" required/>
        <Button label={isPending ? "Saving..." : "Save"} disabled={isPending} type="submit" />
        <MasterPassModal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} />
      </form>
    </div>
  )
}
