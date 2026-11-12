import { serverStorage } from "@/shared/lib/storage"
import { ImapForm } from "../models/settingsSchema";

const IMAP_CONFIG_FILENAME = "config_imap.json"
const IMAP_PASS_HIDE_STRING = "0".repeat(16);
export type ImapConfig = ImapForm & { dek: string};

export const imapConfigFile = {
  save: async function(data: ImapConfig) {
    await serverStorage.saveJson(IMAP_CONFIG_FILENAME, data);
  },
  read: async function(): Promise<ImapConfig | null> {
    const data = await serverStorage.readJson<ImapConfig>(IMAP_CONFIG_FILENAME);
    return data;
  },
  readClient: async function(): Promise<ImapConfig | null> {
    const data = await this.read();
    if (!data) return null;
    return {...data, password: data.password ? IMAP_PASS_HIDE_STRING : ""};
  }
}
