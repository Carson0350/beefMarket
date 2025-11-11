import { auth, signOut } from '@/auth';
import Link from 'next/link';

export default async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
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
