'use client';

import { Button, Input, Modal } from "@/shared/ui"
import { ActionState, saveImap } from "../actions";
import { use, useActionState, useState } from "react";
import { ImapConfig } from "@/entities/imap";

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
  }
})

export const Settings = ({ imapConfig: imapConfigPromise }: SettingsProps) => {
  const imapConfig = use(imapConfigPromise)
  const [state, formAction, isPending] = useActionState(saveImap, createInitialState(imapConfig));
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <h1>IMAP Settings</h1>
      <form action={formAction}>
        <Button label="Октрыть модалку" onClick={() => setIsOpen(true)} />
        <Input label="host" defaultValue={state.fields?.host} name="host" error={state.errors?.host?.[0]} />
        <Input label="port" defaultValue={state.fields?.port} error={state.errors?.port?.[0]} name="port" type="number" />
        <Input label="user" defaultValue={state.fields?.user} error={state.errors?.user?.[0]} name="user" type="email" />
        <Input label="password" defaultValue={state.fields?.password} error={state.errors?.password?.[0]} name="password" type="password" />
        <Button label={isPending ? "Saving..." : "Save"} disabled={isPending} type="submit" />
        {state.message && (
          <p>
            {state.message}
          </p>
        )}
      </form>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Input type="text" />
        <Button label="Принять" onClick={() => setIsOpen(false)} />
      </Modal>
    </div>
  )
}
