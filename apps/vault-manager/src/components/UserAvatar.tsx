import { Avatar, AvatarFallback, AvatarImage } from '@project/components/ui/avatar';
import { useVault } from '../lib/store';

export default function UserAvatar({ className = 'h-8 w-8' }: { className?: string }) {
  const { profile } = useVault();
  const initials = (profile?.displayName ?? '?').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <Avatar className={className}>
      {profile?.avatar && <AvatarImage src={profile.avatar} className="object-cover" />}
      <AvatarFallback className="bg-white font-semibold text-black">{initials}</AvatarFallback>
    </Avatar>
  );
}
