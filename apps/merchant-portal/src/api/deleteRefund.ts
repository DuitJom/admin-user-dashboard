import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Deletes a refund record',
  inputSchema: z.object({ username: z.string(), password: z.string(), id: z.string() }),
  outputSchema: z.object({ success: z.boolean() }),
  execute: async ({ input }) => {
    if (input.username.trim() !== process.env.ZITE_ADMIN_USERNAME || input.password !== process.env.ZITE_ADMIN_PASSWORD) {
      throw new ZiteError('Invalid admin credentials.');
    }
    await zite.refundRecords.delete({ id: input.id });
    return { success: true };
  },
});
