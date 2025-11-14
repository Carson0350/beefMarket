import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import AuthButton from '@/components/AuthButton';
import NotificationList from '@/components/NotificationList';

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?returnTo=/notifications');
  }

  // Get notifications from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
      createdAt: { gte: thirtyDaysAgo },
    },
    include: {
      bull: {
        select: {
          id: true,
          name: true,
          slug: true,
          heroImage: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const unreadCount = await prisma.notification.count({
    where: {
      userId: session.user.id,
      isRead: false,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
            BeefStore
          </Link>
          <AuthButton />
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="mt-2 text-gray-600">
                Stay updated on your favorited bulls
              </p>
            </div>
            {unreadCount > 0 && (
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                {unreadCount} unread
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NotificationList notifications={notifications} />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Notifications - BeefStore',
  description: 'View your notification history',
};
