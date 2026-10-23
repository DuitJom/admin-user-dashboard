import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';

const MERCHANT_ID = '2000166629929';
const PASSKEY = '$sshUSer11';

export default createEndpoint({
  description: 'Checks a Merchant ID and passkey against the authorised merchant',
  inputSchema: z.object({ merchantId: z.string(), passkey: z.string() }),
  outputSchema: z.object({ valid: z.boolean() }),
  execute: async ({ input }) => ({
    valid: input.merchantId.trim() === MERCHANT_ID && input.passkey === PASSKEY,
  }),
});
