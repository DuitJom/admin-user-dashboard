export const CLIENT = {
  fullName: 'MOHD SHAHRUL NIZAM BIN CHE RAHIM',
  myKad: '850101-03-6581',
  email: 'che.nobita77@gmail.com',
  phone: '+60 172848097',
  merchantName: 'GETMORE RESOURCES SDN BHD',
  product: 'DUITJOM FINANCE / GETMORE RESOURCES',
  status: 'OVERDUE',
};

export const COMPANY = {
  name: 'GETMORE RESOURCES SDN BHD',
  ssm: 'SSM: 202101021538 / 1421838-P',
  fax: '+60 16-534 9363',
  service: 'Financial Product',
  address: '47A Tingkat, Bandar Sunway, 1, Jln Todak 4, Seberang Jaya, 13700 Perai, Pulau Pinang.',
  maps: 'https://maps.google.com/maps/place//data=!4m2!3m1!1s0x304ac5c47c1e91ed:0x865f1174ab57e5f7?entry=s&sa=X&ved=2ahUKEwiGg9XRkc6XAxWf1DgGHTGcAosQ4kB6BAgEEAA&hl=en',
};

export const mask = (s: string, keep = 4) =>
  s.split('').map((c, i) => (i < s.length - keep && /[A-Za-z0-9]/.test(c) ? '•' : c)).join('');
