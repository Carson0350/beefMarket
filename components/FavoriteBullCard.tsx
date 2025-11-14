'use client';

import BullCard from './BullCard';
import NotificationToggle from './NotificationToggle';

interface FavoriteBullCardProps {
  bull: any;
  notificationsEnabled: boolean;
}

export default function FavoriteBullCard({
  bull,
  notificationsEnabled,
}: FavoriteBullCardProps) {
  return (
    <div className="relative">
      <BullCard bull={bull} isFavorited={true} />
      <div className="absolute top-2 right-2 bg-white rounded-full shadow-md">
        <NotificationToggle
          bullId={bull.id}
          bullName={bull.name}
          initialEnabled={notificationsEnabled}
        />
      </div>
    </div>
  );
}
