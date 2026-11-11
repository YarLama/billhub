'use client';

import { Button, Input } from "@/shared/ui"
import { ActionState, saveImap } from "../actions";
import { useActionState } from "react";

const initialState: ActionState = {
  success: false,
  errors: {},
  message: "",
  fields: {
    host: "",
    port: "",
    user: "",
    password: "",
  }
}

export const Settings = () => {

  const [state, formAction, isPending] = useActionState(saveImap, initialState);

  return (
    <div>
      <h1>IMAP Settings</h1>
      <form action={formAction}>
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
    </div>
  )
}
