import { serverStorage } from "@/shared/lib/storage"
import { ImapForm } from "../models/settingsSchema";

const IMAP_CONFIG_FILENAME = "config_imap.json"
export type ImapConfig = ImapForm & { dek: string};

export const imapConfigFile = {
  save: async function(data: ImapConfig) {
    await serverStorage.saveJson(IMAP_CONFIG_FILENAME, data);
  },
  read: async function(): Promise<ImapConfig | null> {
    const data = await serverStorage.readJson<ImapConfig>(IMAP_CONFIG_FILENAME);
    return data;
  }
}
