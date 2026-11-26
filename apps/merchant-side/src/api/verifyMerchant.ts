import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';

// Each brand has its own Merchant ID and passkey.
const BRANDS: { product: string; merchantId: string; passkey: string }[] = [
  { product: 'DUITJOM', merchantId: '2000162100241', passkey: '$sshUSer00' },
  { product: 'RCASH', merchantId: '825538292000', passkey: '@102zxKLaq57' },
  { product: 'LAJUDANA', merchantId: '730114885201', passkey: '#Lj9danaKp42' },
  { product: 'PINJAMGO', merchantId: '648209173355', passkey: 'Pg!57goQxm83' },
  { product: 'ADAWANG', merchantId: '915374620088', passkey: 'Aw3$wangZt16' },
  { product: 'MESRA DUIT', merchantId: '204867351199', passkey: 'Md!7sraLp904' },
  { product: 'QUICKLOAN', merchantId: '573928104466', passkey: 'Ql8#ickBn251' },
  { product: 'EZYLOAN', merchantId: '386150729744', passkey: 'Ez5%yLoNq637' },
];

export default createEndpoint({
  description: 'Checks a Merchant ID (and optionally its passkey) and returns the matching product name',
  inputSchema: z.object({ merchantId: z.string(), passkey: z.string().optional() }),
  outputSchema: z.object({ valid: z.boolean(), product: z.string().nullable() }),
  execute: async ({ input }) => {
    const brand = BRANDS.find((b) => b.merchantId === input.merchantId.trim());
    if (!brand) return { valid: false, product: null };
    // Step 1: Merchant ID only — reveal the product name.
    if (input.passkey === undefined) return { valid: true, product: brand.product };
    // Step 2: passkey must match this brand.
    return { valid: input.passkey === brand.passkey, product: brand.product };
  },
});
