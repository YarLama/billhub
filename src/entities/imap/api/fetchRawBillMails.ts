import { ImapFlow } from "imapflow";
import { RawBillMail } from "../models/types";
import { simpleParser } from "mailparser";
import { serverStorage } from "@/shared/lib/storage";

export async function fetchRawBillMails(
  client: ImapFlow,
  monthKey: string
): Promise<RawBillMail[]> {
  const results: RawBillMail[] = [];
  const lock = await client.getMailboxLock("ЖКХ");
  const dayOffset = 3;
  try {
    const now = new Date();
    const sinceDate = new Date(now.getFullYear(), now.getMonth(), 1 - dayOffset);
    const uids = await client.search({ since: sinceDate }, { uid: true });
    if (!uids || uids.length === 0) return [];

    for await (const message of client.fetch(uids, { source: true }, { uid: true })) {
      if (!message.source) continue;
      const parsed = await simpleParser(message.source);
      const pdfAttachments = parsed.attachments.filter((att) => (
        att.contentType === "application/pdf" ||
        att.filename?.toLowerCase().endsWith(".pdf")
      ));
      if (pdfAttachments.length === 0) continue;
      const senderName = parsed.from?.value?.[0]?.name ||
        parsed.from?.value?.[0]?.address ||
        "Unknown sender";
      const subject = parsed.subject ?? "";
      const savedFiles: RawBillMail["savedFiles"] = [];

      for (const att of pdfAttachments) {
        const rawName = att.filename || `${senderName}.pdf`;
        const safeName = rawName.replace(/[^a-zA-Zа-яА-Я0-9._-]/g, "_");
        const relativePath = `static/${monthKey}/${safeName}`;
        await serverStorage.saveFile(relativePath, att.content);

        savedFiles.push({
          originalName: rawName,
          publicUrl: `/api/static/${monthKey}/${encodeURIComponent(safeName)}`
        });
      }

      results.push({
        uid: message.uid,
        senderName,
        subject,
        savedFiles
      });
    }
  } finally {
    lock.release();
  }

  return results;
}
