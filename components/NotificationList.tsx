'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { BellIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  bull: {
    id: string;
    name: string;
    slug: string;
    heroImage: string;
  };
}

interface NotificationListProps {
  notifications: Notification[];
}

export default function NotificationList({ notifications: initialNotifications }: NotificationListProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'inventory' | 'price'>('all');

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'inventory') return n.type === 'INVENTORY_CHANGE';
    if (filter === 'price') return n.type === 'PRICE_CHANGE';
    return true;
  });

  if (notifications.length === 0) {
    return (
      <div className="text-center py-16">
        <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No notifications</h3>
        <p className="mt-1 text-sm text-gray-500">
          You'll see notifications here when bulls you favorite have updates
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter('inventory')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === 'inventory'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Inventory
        </button>
        <button
          onClick={() => setFilter('price')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === 'price'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Price
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow p-4 ${
              !notification.isRead ? 'border-l-4 border-blue-500' : ''
            }`}
            onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
          >
            <div className="flex gap-4">
              <img
                src={notification.bull.heroImage}
                alt={notification.bull.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {notification.type === 'PRICE_CHANGE' ? (
                        <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <BellIcon className="h-5 w-5 text-blue-600" />
                      )}
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <Link
                      href={`/bulls/${notification.bull.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                    >
                      View {notification.bull.name} →
                    </Link>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    {!notification.isRead && (
                      <span className="inline-block mt-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
