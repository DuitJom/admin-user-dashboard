import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Creates or updates a refund record',
  inputSchema: z.object({
    username: z.string(),
    password: z.string(),
    id: z.string().optional(),
    record: z.object({
      fullName: z.string(),
      avatarUrl: z.string().nullable(),
      dateTime: z.string().nullable(),
      myKad: z.string(),
      amountRefund: z.number().nullable(),
      bankAccNo: z.string(),
      rm: z.number().nullable(),
      status: z.string(),
    }),
  }),
  outputSchema: z.object({ id: z.string() }),
  execute: async ({ input }) => {
    if (input.username.trim() !== process.env.ZITE_ADMIN_USERNAME || input.password !== process.env.ZITE_ADMIN_PASSWORD) {
      throw new ZiteError('Invalid admin credentials.');
    }
    const { avatarUrl, ...rest } = input.record;
    const record = { ...rest, avatar: avatarUrl ? [{ url: avatarUrl }] : null };
    if (input.id) {
      await zite.refundRecords.update({ id: input.id, record });
      return { id: input.id };
    }
    const created = await zite.refundRecords.create({ record });
    return { id: created.id };
  },
});
