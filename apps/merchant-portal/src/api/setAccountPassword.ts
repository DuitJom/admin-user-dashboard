import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

// First-time setup: saves an access password onto an account record that does
// not have one yet. It never overwrites an existing password.
export default createEndpoint({
  description: 'Sets the access password on an account that has none yet (account settings)',
  inputSchema: z.object({
    merchantId: z.string(),
    password: z.string().min(1),
  }),
  outputSchema: z.object({ success: z.boolean() }),
  execute: async ({ input }) => {
    const merchantId = input.merchantId.trim();
    const account = await zite.duitJomCrmData.findOne({
      filters: { merchantIdUser: merchantId },
    });
    if (!account) throw new Error('Account not found for this Merchant ID.');
    if ((account.passkey ?? '').trim()) {
      throw new Error('A password is already set for this account.');
    }
    await zite.duitJomCrmData.update({
      id: account.id,
      record: { passkey: input.password },
    });
    return { success: true };
  },
});
