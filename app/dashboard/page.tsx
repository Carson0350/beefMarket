import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email:</p>
              <p className="text-lg font-medium">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role:</p>
              <p className="text-lg font-medium">{session.user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">User ID:</p>
              <p className="text-lg font-mono text-gray-700">{session.user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
