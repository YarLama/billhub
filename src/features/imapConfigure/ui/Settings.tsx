import { Button, Input } from "@/shared/ui"


export const Settings = () => {
  return (
    <div>
      <h1>IMAP Settings</h1>
      <form>
        <Input label="host"/>
        <Input label="port" type="number"/>
        <Input label="user" type="email"/>
        <Input label="password" type="password"/>
        <Button label="Save"/>
      </form>
    </div>
  )
}
