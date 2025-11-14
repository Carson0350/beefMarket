import { auth, signOut } from '@/auth';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { HeartIcon } from '@heroicons/react/24/outline';

export default async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    // Fetch favorites count for logged-in users
    const favoritesCount = await prisma.favorite.count({
      where: { userId: session.user.id },
    });

    return (
      <div className="flex items-center gap-4">
        <Link
          href="/favorites"
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <HeartIcon className="h-5 w-5" />
          <span>Favorites</span>
          {favoritesCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
              {favoritesCount}
            </span>
          )}
        </Link>
        <span className="text-sm text-gray-700">
          {session.user.name || session.user.email}
        </span>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Sign Up
      </Link>
    </div>
  );
}
