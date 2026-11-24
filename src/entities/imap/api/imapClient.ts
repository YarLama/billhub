import { ImapFlow } from "imapflow";
import { ImapConfig } from "./imapConfigFile";

export async function withImapClient<T>(
  config: ImapConfig,
  password: string,
  callback: (client: ImapFlow) => Promise<T>
): Promise<T> {
  const client = new ImapFlow({
    host: config.host,
    port: Number(config.port) || 993,
    secure: true,
    auth: {
      user: config.user,
      pass: password,
    },
    logger: false,
    connectionTimeout: 5000,
    greetingTimeout: 5000,
  });

  try {
    await client.connect();

    return await callback(client);
  } finally {
    if (client.usable) {
      await client.logout().catch(() => client.close());
    } else client.close();
  }
}
