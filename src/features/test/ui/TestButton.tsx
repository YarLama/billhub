'use client';

import { runTestCrypto, runTestStorage } from "../actions";

export function TestButton() {
  
  const handleTest = async () => {
    //await runTestStorage();
    await runTestCrypto();
  }

  return(
    <button onClick={handleTest}>
      Test click
    </button>
  )
}
