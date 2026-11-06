const encoder = new TextEncoder();
const decoder = new TextDecoder();

function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

function U8AToBase64(uint: Uint8Array): string {
  return Buffer.from(uint).toString('base64');
}

function Base64ToU8A(base: string): Uint8Array {
  return new Uint8Array(Buffer.from(base, 'base64'));
}

async function deriveKeyFromMaster(masterPassword: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(masterPassword),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey({
    name: 'PBKDF2',
    salt: salt as BufferSource,
    iterations: 100000,
    hash: 'SHA-256',
  }, baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

async function importDek(dek: string): Promise<CryptoKey> {
  const rawDek = Base64ToU8A(dek);
  return crypto.subtle.importKey(
    'raw',
    rawDek as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export function generateRandomDek(): string {
  return U8AToBase64(generateRandomBytes(32));
}

export async function encryptDekWithMaster(dek: string, masterPassword: string): Promise<string> {
  const salt = generateRandomBytes(16);
  const iv = generateRandomBytes(12);
  const key = await deriveKeyFromMaster(masterPassword, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    encoder.encode(dek)
  );
  return `${U8AToBase64(salt)}:${U8AToBase64(iv)}:${U8AToBase64(new Uint8Array(encrypted))}`;
}

export async function decryptDekWithMaster(encryptedDek: string, masterPassword: string): Promise<string> {
  const [salt64, iv64, encrypted64] = encryptedDek.split(':');
  if (!salt64 || !iv64 || !encrypted64) throw new Error('Failed DEK format');
  const salt = Base64ToU8A(salt64);
  const iv = Base64ToU8A(iv64);
  const encrypted = Base64ToU8A(encrypted64);
  const key = await deriveKeyFromMaster(masterPassword, salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    encrypted as BufferSource
  );

  return decoder.decode(decrypted);
}


export async function encryptPassword(password: string, dek64: string): Promise<string> {
  const iv = generateRandomBytes(12);
  const key = await importDek(dek64);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    encoder.encode(password)
  );

  return `${U8AToBase64(iv)}:${U8AToBase64(new Uint8Array(encrypted))}`;
}

export async function decryptPassword(encryptedPassword: string, dek64: string): Promise<string> {
  const [iv64, encrypted64] = encryptedPassword.split(':');
  if (!iv64 || !encrypted64) throw new Error('Failed Password format');
  const iv = Base64ToU8A(iv64);
  const encrypted = Base64ToU8A(encrypted64);
  const key = await importDek(dek64);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    encrypted as BufferSource
  );

  return decoder.decode(decrypted);
}


