import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import BullCard from '@/components/BullCard';
import ShareButton from '@/components/ShareButton';
import { ChevronLeftIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

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

  // Calculate statistics
  const totalBulls = ranch.bulls.length;
  const uniqueBreeds = new Set(ranch.bulls.map(b => b.breed));
  const breedsCount = uniqueBreeds.size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb and Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href="/bulls" className="hover:text-gray-700">Bulls</Link>
            <span>/</span>
            <span className="text-gray-900">{ranch.name}</span>
          </nav>
          
          <Link 
            href="/bulls"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Browse
          </Link>
        </div>
      </div>

      {/* Ranch Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{ranch.name}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-1" />
                <span className="text-lg">{ranch.state}</span>
              </div>
            </div>
            <ShareButton />
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Bulls Available</p>
              <p className="text-3xl font-bold text-gray-900">{totalBulls}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Breeds Offered</p>
              <p className="text-3xl font-bold text-gray-900">{breedsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {ranch.about && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Ranch</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ranch.about}</p>
              </div>
            )}

            {/* Bulls Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Our Bulls {totalBulls > 0 && `(${totalBulls})`}
              </h2>
              {totalBulls === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Bulls Currently Available
                  </h3>
                  <p className="text-gray-600">
                    This ranch doesn&apos;t have any bulls listed at the moment. Please check back later!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ranch.bulls.map((bull) => (
                    <BullCard 
                      key={bull.id} 
                      bull={{
                        ...bull,
                        ranch: {
                          name: ranch.name,
                          slug: ranch.slug,
                        },
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Email
                  </div>
                  <a 
                    href={`mailto:${ranch.contactEmail}`}
                    className="text-blue-600 hover:text-blue-800 break-all text-sm"
                  >
                    {ranch.contactEmail}
                  </a>
                </div>

                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Phone
                  </div>
                  <a 
                    href={`tel:${ranch.contactPhone}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {ranch.contactPhone}
                  </a>
                </div>

                {ranch.websiteUrl && (
                  <div>
                    <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <GlobeAltIcon className="h-4 w-4 mr-2" />
                      Website
                    </div>
                    <a 
                      href={ranch.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-all text-sm"
                    >
                      {ranch.websiteUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={`mailto:${ranch.contactEmail}`}
                    className="block w-full text-center py-3 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Contact Ranch
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const ranch = await prisma.ranch.findUnique({
    where: { slug: params.slug },
    select: { name: true, state: true, about: true },
  });
  
  if (!ranch) {
    return {
      title: 'Ranch Not Found',
    };
  }

  return {
    title: `${ranch.name} - ${ranch.state} | Wagner Beef`,
    description: ranch.about || `View bulls from ${ranch.name}, a cattle ranch in ${ranch.state}.`,
  };
}
