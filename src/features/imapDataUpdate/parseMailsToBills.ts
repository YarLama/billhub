import { Bill } from "@/entities/bills";
import { RawBillMail } from "@/entities/imap";

export function parseMailsToBills(rawMails: RawBillMail[]): Bill[] {
  const bills: Bill[] = [];

  for (const mail of rawMails) {
    for (const file of mail.savedFiles) {
      bills.push({
        id: crypto.randomUUID(),
        name: mail.senderName,
        amount: 0,
        url: file.publicUrl,
        description: mail.subject || undefined,
        isPaid: false,
      });
    }
  }

  return bills;
}
