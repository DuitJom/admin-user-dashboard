import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

// Verifies a client's access password against the password stored on their
// account record (DuitJom CRM Data), matched by Merchant ID. The password is
// never returned to the browser — only a status is.
export default createEndpoint({
  description: 'Checks a Merchant ID account password, or reports that one still needs to be set',
  inputSchema: z.object({
    merchantId: z.string(),
    password: z.string().optional(),
  }),
  outputSchema: z.object({
    status: z.enum(['notfound', 'needsSetup', 'ready', 'valid', 'invalid']),
  }),
  execute: async ({ input }) => {
    const merchantId = input.merchantId.trim();
    const account = await zite.duitJomCrmData.findOne({
      filters: { merchantIdUser: merchantId },
    });
    if (!account) return { status: 'notfound' as const };

    const stored = (account.passkey ?? '').trim();
    // No password set on this account yet — the client must create one.
    if (!stored) return { status: 'needsSetup' as const };

    // Lookup only (no password supplied): a password exists, ready to enter.
    if (input.password === undefined) return { status: 'ready' as const };

    // Only this account's own password is accepted; any other is rejected.
    return { status: input.password === stored ? ('valid' as const) : ('invalid' as const) };
  },
});
