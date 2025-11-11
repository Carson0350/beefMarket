'use client';

import { useState } from 'react';
import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';

interface NotificationToggleProps {
  bullId: string;
  bullName: string;
  initialEnabled: boolean;
  onToggle?: (enabled: boolean) => void;
}

export default function NotificationToggle({
  bullId,
  bullName,
  initialEnabled,
  onToggle,
}: NotificationToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !enabled;

    // Optimistic update
    setEnabled(newState);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/favorites/${bullId}/notifications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newState }),
      });

      if (!res.ok) {
        throw new Error('Failed to update notifications');
      }

      // Call optional callback
      onToggle?.(newState);
    } catch (error) {
      // Revert on error
      setEnabled(!newState);
      console.error('Failed to toggle notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = enabled ? BellIconSolid : BellSlashIcon;
  const tooltipText = enabled
    ? `Notifications ON for ${bullName}`
    : `Notifications OFF for ${bullName}`;

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        enabled
          ? 'text-blue-600 hover:bg-blue-50'
          : 'text-gray-400 hover:bg-gray-100'
      } disabled:opacity-50`}
      title={tooltipText}
      aria-label={tooltipText}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
