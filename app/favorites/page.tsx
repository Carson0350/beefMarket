import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import FavoriteBullCard from '@/components/FavoriteBullCard';
import BulkNotificationActions from '@/components/BulkNotificationActions';
import { HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import AuthButton from '@/components/AuthButton';

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?returnTo=/favorites');
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      bull: {
        include: {
          ranch: {
            select: { name: true, slug: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
            WagnerBeef
          </Link>
          <AuthButton />
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="mt-2 text-gray-600">
            Bulls you&apos;ve saved for future reference
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
              <HeartIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing bulls and save your favorites here for easy access later
            </p>
            <Link
              href="/bulls"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Bulls
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                {favorites.length} {favorites.length === 1 ? 'bull' : 'bulls'} saved
              </p>
            </div>
            <BulkNotificationActions favoriteCount={favorites.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map(({ bull, notificationsEnabled }) => (
                <FavoriteBullCard
                  key={bull.id}
                  bull={bull}
                  notificationsEnabled={notificationsEnabled}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'My Favorites - WagnerBeef',
  description: 'View your saved favorite bulls',
};
