import { emptyItem, VaultItem } from './types';

const day = 86_400_000;
const mk = (p: Partial<VaultItem>, ageDays = 3): VaultItem => {
  const base = emptyItem(p.type ?? 'login');
  const t = Date.now() - ageDays * day;
  return { ...base, ...p, createdAt: t, updatedAt: t };
};

export const seedItems = (): VaultItem[] => [
  mk({ name: 'Gmail', folder: 'Kerja', username: 'aminah.kerja@gmail.com', password: 'Gm@il#2026Secure!', url: 'https://mail.google.com', totp: 'JBSWY3DPEHPK3PXP', favorite: true }, 10),
  mk({ name: 'Maybank2u', folder: 'Bank', username: 'aminah88', password: 'password123', url: 'https://www.maybank2u.com.my', favorite: true }, 420),
  mk({ name: 'Shopee', folder: 'Shopping', username: 'aminah.shop', password: 'password123', url: 'https://shopee.com.my' }, 30),
  mk({ name: 'Netflix', folder: 'Sosial', username: 'keluarga@gmail.com', password: 'Nflx!Mov13s', url: 'https://netflix.com', shared: true }, 200),
  mk({ type: 'card', name: 'Kad Maybank Visa', folder: 'Bank', cardHolder: 'AMINAH BINTI ALI', cardNumber: '4111111111111111', cardExpiry: '08/29', cardCvv: '123' }, 60),
  mk({ type: 'identity', name: 'Passport', fullName: 'Aminah binti Ali', idNumber: 'A12345678', phone: '+60 12-345 6789', address: 'Kuala Lumpur, Malaysia' }, 90),
  mk({ type: 'note', name: 'WiFi Rumah', notes: 'SSID: Rumah_5G\nKata laluan: Kucing#Oren2024', shared: true }, 15),
  mk({ type: 'note', name: 'API Key GitHub', folder: 'Kerja', notes: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\nSkop: repo, workflow' }, 5),
];
