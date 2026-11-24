
export type RawBillMail = {
  uid: number;
  senderName: string;
  subject: string;
  savedFiles: {
    originalName: string;
    publicUrl: string;
  }[]
}
