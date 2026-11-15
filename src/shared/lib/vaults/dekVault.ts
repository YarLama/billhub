import 'server-only';

interface DekVaultState {
  dek: string | null;
  expiresAt: number;
}

const globalForVault = globalThis as unknown as {
  __dekVaultState?: DekVaultState
}

const state: DekVaultState = globalForVault.__dekVaultState ?? {
  dek: null,
  expiresAt: 0,
}

if (process.env.NODE_ENV === 'production') {
  globalForVault.__dekVaultState = state;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000;

export const dekVault = {
  set(dek: string, ttlMs = DEFAULT_TTL_MS): void {
    state.dek = dek;
    state.expiresAt = Date.now() + ttlMs;
  },
  get(): string | null {
    if (!state.dek) return null;
    if (Date.now() > state.expiresAt) {
      this.clear();
      return null;
    }
    state.expiresAt = Date.now() + DEFAULT_TTL_MS;
    return state.dek
  },
  clear(): void {
    state.dek = null;
    state.expiresAt = 0;
  }
};
