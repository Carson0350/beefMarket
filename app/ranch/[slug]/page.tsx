import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function RanchProfilePage({ params }: PageProps) {
  const { slug } = params;

  // Fetch ranch by slug
  const ranch = await prisma.ranch.findUnique({
    where: { slug },
    include: {
      bulls: {
        where: {
          status: 'PUBLISHED',
          archived: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!ranch) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900">{ranch.name}</h1>
          <p className="mt-2 text-lg text-gray-600">{ranch.state}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About Section */}
            {ranch.about && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Ranch</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{ranch.about}</p>
              </div>
            )}

            {/* Bulls Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Bulls ({ranch.bulls.length})
              </h2>
              {ranch.bulls.length === 0 ? (
                <p className="text-gray-600">No bulls available at this time.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ranch.bulls.map((bull) => (
                    <div key={bull.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-lg text-gray-900">{bull.name}</h3>
                      <p className="text-sm text-gray-600">{bull.breed}</p>
                      {bull.registrationNumber && (
                        <p className="text-xs text-gray-500 mt-1">Reg: {bull.registrationNumber}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <a 
                    href={`mailto:${ranch.contactEmail}`}
                    className="text-blue-600 hover:text-blue-700 break-all"
                  >
                    {ranch.contactEmail}
                  </a>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <a 
                    href={`tel:${ranch.contactPhone}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {ranch.contactPhone}
                  </a>
                </div>

                {ranch.websiteUrl && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Website</p>
                    <a 
                      href={ranch.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 break-all"
                    >
                      {ranch.websiteUrl}
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href="/browse"
                    className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Browse All Bulls
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
