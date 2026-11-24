'use server';
import { billsConfigFile, getMonthKey, mergeBills } from "@/entities/bills";
import { billsDataFile } from "@/entities/bills/api/dataFile";
import { fetchRawBillMails, imapConfigFile, withImapClient } from "@/entities/imap";
import { decryptDekWithMaster, decryptPassword } from "@/shared/lib/crypto";
import { dekVault } from "@/shared/lib/vaults";
import { ImapFlowError } from "imapflow";
import { parseMailsToBills } from "./parseMailsToBills";

export type ImapUpdateDataResult =
  | { status: 'SUCCESS' }
  | { status: 'NEED_PASSWORD' }
  | { status: 'INVALID_PASSWORD' }
  | { status: 'ERROR', message: string };

interface UpdateOptions {
  masterPassword?: string;
  cache?: boolean;
}

export async function imapUpdateDataAction(options?: UpdateOptions): Promise<ImapUpdateDataResult> {
  const { masterPassword, cache = true } = options ?? {};

  const config = await imapConfigFile.read();
  if (!config || !config.password || !config.dek) {
    return { status: 'ERROR', message: 'imap config file not found' };
  }

  let dek = dekVault.get();
  if (!dek) {
    if (!masterPassword) {

      return { status: 'NEED_PASSWORD' };
    }

    try {
      dek = await decryptDekWithMaster(config.dek, masterPassword);
      if (cache) dekVault.set(dek);
    } catch {
      return { status: 'INVALID_PASSWORD' };
    }
  }

  try {
    const plainPassword = await decryptPassword(config.password, dek);
    const monthKey = getMonthKey();

    const rawMails = await withImapClient(config, plainPassword, (client) => fetchRawBillMails(client, monthKey));

    const fetchedBills = parseMailsToBills(rawMails);
    const defaultBills = (await billsConfigFile.read()) ?? [];
    const currentData = (await billsDataFile.read()) ?? {};

    currentData[monthKey] = mergeBills(currentData[monthKey], defaultBills, fetchedBills)

    await billsDataFile.save(currentData);

    return { status: 'SUCCESS' };
  } catch (e) {
    let message = "IMAP connection is failed";
    if ((e as ImapFlowError)?.authenticationFailed) {
      message = "Wrong user or password from mail";
    } else if ((e as ImapFlowError)?.code === 'ENOTFOUND' || (e as ImapFlowError)?.code === 'ETIMEOUT') {
      message = "Server unreachable (try check host or port)";
    } else if (e instanceof Error) {
      message = e.message;
    }
    return {
      status: 'ERROR',
      message,
    };
  }
}
