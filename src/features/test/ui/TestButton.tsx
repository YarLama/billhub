'use client';

import { runTestStorage } from "../actions";

export function TestButton() {
  
  const handleTest = async () => {
    await runTestStorage();
  }

  return(
    <button onClick={handleTest}>
      Test click
    </button>
  )
}
