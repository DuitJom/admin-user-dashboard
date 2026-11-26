import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Lists refund records for the admin',
  inputSchema: z.object({ username: z.string(), password: z.string() }),
  outputSchema: z.object({
    records: z.array(z.object({
      id: z.string(),
      fullName: z.string(),
      avatarUrl: z.string().nullable(),
      dateTime: z.string().nullable(),
      myKad: z.string(),
      amountRefund: z.number().nullable(),
      bankAccNo: z.string(),
      rm: z.number().nullable(),
      status: z.string(),
    })),
  }),
  execute: async ({ input }) => {
    if (input.username.trim() !== process.env.ZITE_ADMIN_USERNAME || input.password !== process.env.ZITE_ADMIN_PASSWORD) {
      throw new ZiteError('Invalid admin credentials.');
    }
    const { records } = await zite.refundRecords.findAll({ limit: 2000 });
    return {
      records: records.map((r) => ({
        id: r.id,
        fullName: r.fullName ?? '',
        avatarUrl: r.avatar?.[0]?.url ?? null,
        dateTime: r.dateTime ?? null,
        myKad: r.myKad ?? '',
        amountRefund: r.amountRefund ?? null,
        bankAccNo: r.bankAccNo ?? '',
        rm: r.rm ?? null,
        status: r.status ?? 'Pending',
      })),
    };
  },
});
