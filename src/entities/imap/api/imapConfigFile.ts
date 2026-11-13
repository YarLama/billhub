import { serverStorage } from "@/shared/lib/storage"
import { ImapForm } from "../models/settingsSchema";

const IMAP_CONFIG_FILENAME = "config_imap.json"
export const IMAP_PASS_HIDE_STRING = "c8ec0c428d823762cb3311fabb74b59c";
export type ImapConfig = Omit<ImapForm & { dek: string}, "masterPassword">;

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
