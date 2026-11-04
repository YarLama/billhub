import fs from "fs/promises";
import path from "path";

const getBaseDir = () => {
  const envPath = process.env.DEFAULT_PATH;
  if (!envPath) return path.join(process.cwd(), 'data');
  return path.isAbsolute(envPath) ? envPath : path.resolve(process.cwd(), envPath);
}

const BASE_DIR = getBaseDir();

async function ensureDirectoryAndGetPath(relativePath: string): Promise<string> {
  const absolutePath = path.join(BASE_DIR, relativePath);
  const dirName = path.dirname(absolutePath);
  await fs.mkdir(dirName, { recursive: true });
  return absolutePath;
}

export const serverStorage = {
  async saveJson<T>(relativePath: string, data: T): Promise<void> {
    const fullPath = await ensureDirectoryAndGetPath(relativePath);
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
  },
  async readJson<T>(relativePath: string): Promise<T | null> {
    try {
      const fullPath = path.join(BASE_DIR, relativePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  },
  async saveFile(relativePath: string, buffer: Buffer | Uint8Array): Promise<void> {
    const fullPath = await ensureDirectoryAndGetPath(relativePath);
    await fs.writeFile(fullPath, buffer);
  },
  async readFile(relativePath: string): Promise<Buffer | null> {
    try {
      const fullPath = path.join(BASE_DIR, relativePath);
      return await fs.readFile(fullPath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }
}
