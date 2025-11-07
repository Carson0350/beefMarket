import AuthButton from '@/components/AuthButton';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">WagnerBeef</h1>
          <AuthButton />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">
            Welcome to WagnerBeef
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional bull breeding marketplace connecting ranchers with breeders
          </p>
          
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <span>✓</span>
              <span>Next.js 14+</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <span>✓</span>
              <span>TypeScript</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
              <span>✓</span>
              <span>Tailwind CSS</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <span>✓</span>
              <span>ESLint</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg">
              <span>✓</span>
              <span>Prisma + PostgreSQL</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-800 rounded-lg">
              <span>✓</span>
              <span>NextAuth.js</span>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
