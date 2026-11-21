export type ItemType = 'login' | 'card' | 'identity' | 'note';
export type FolderName = 'Kerja' | 'Bank' | 'Sosial' | 'Shopping' | '';

export const FOLDERS: Exclude<FolderName, ''>[] = ['Kerja', 'Bank', 'Sosial', 'Shopping'];
export const TYPE_LABEL: Record<ItemType, string> = {
  login: 'Login',
  card: 'Kad',
  identity: 'Identiti',
  note: 'Nota Selamat',
};

export interface VaultItem {
  id: string;
  type: ItemType;
  name: string;
  folder: FolderName;
  favorite: boolean;
  shared: boolean;
  deleted: boolean;
  notes: string;
  username: string;
  password: string;
  url: string;
  totp: string;
  cardHolder: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  fullName: string;
  idNumber: string;
  phone: string;
  address: string;
  createdAt: number;
  updatedAt: number;
}

export interface SendItem {
  id: string;
  kind: 'text' | 'password';
  name: string;
  content: string;
  expiresAt: number;
  maxViews: number;
  views: number;
  password: string;
  createdAt: number;
}

export interface Profile {
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  masterHash: string;
  salt: string;
  timeoutMin: number; // 0 = never
}

export interface ActivityLog {
  id: string;
  at: number;
  text: string;
}

export interface VaultData {
  items: VaultItem[];
  sends: SendItem[];
  profile: Profile | null;
  logs: ActivityLog[];
}

export const emptyItem = (type: ItemType = 'login'): VaultItem => ({
  id: crypto.randomUUID(),
  type,
  name: '',
  folder: '',
  favorite: false,
  shared: false,
  deleted: false,
  notes: '',
  username: '',
  password: '',
  url: '',
  totp: '',
  cardHolder: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  fullName: '',
  idNumber: '',
  phone: '',
  address: '',
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
