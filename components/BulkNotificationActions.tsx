'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';

interface BulkNotificationActionsProps {
  favoriteCount: number;
}

export default function BulkNotificationActions({
  favoriteCount,
}: BulkNotificationActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState<'enable' | 'disable' | null>(
    null
  );

  const handleBulkAction = async (enabled: boolean) => {
    setIsLoading(true);
    setShowConfirm(null);

    try {
      const res = await fetch('/api/favorites/notifications/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });

      if (!res.ok) {
        throw new Error('Failed to update notifications');
      }

      // Refresh the page to show updated state
      router.refresh();
    } catch (error) {
      console.error('Failed to bulk update notifications:', error);
      alert('Failed to update notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (favoriteCount === 0) {
    return null;
  }

  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="text-sm text-gray-600">Notification settings:</span>
      <button
        onClick={() => setShowConfirm('enable')}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 transition-colors"
      >
        <BellIcon className="h-4 w-4" />
        Enable All
      </button>
      <button
        onClick={() => setShowConfirm('disable')}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
      >
        <BellSlashIcon className="h-4 w-4" />
        Disable All
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {showConfirm === 'enable'
                ? 'Enable All Notifications?'
                : 'Disable All Notifications?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {showConfirm === 'enable'
                ? `You will receive notifications for all ${favoriteCount} favorited bulls.`
                : `You will stop receiving notifications for all ${favoriteCount} favorited bulls.`}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(null)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBulkAction(showConfirm === 'enable')}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
