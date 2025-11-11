import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { ChevronLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import ShareButton from '@/components/ShareButton';
import FavoriteButton from '@/components/FavoriteButton';

interface PageProps {
  params: { slug: string };
}

async function getBull(slug: string) {
  const bull = await prisma.bull.findUnique({
    where: {
      slug,
      status: 'PUBLISHED',
      archived: false,
    },
    include: {
      ranch: {
        select: {
          name: true,
          slug: true,
          state: true,
          contactEmail: true,
          contactPhone: true,
        },
      },
    },
  });

  return bull;
}

function calculateAge(birthDate: Date | null): string {
  if (!birthDate) return 'Unknown';
  
  const today = new Date();
  const birth = new Date(birthDate);
  const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  
  if (ageInMonths < 12) {
    return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
  }
  
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  
  if (months === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  
  return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getAvailabilityStatus(straws: number) {
  if (straws === 0) return { text: 'Sold Out', color: 'bg-red-100 text-red-800' };
  if (straws < 10) return { text: 'Limited Availability', color: 'bg-yellow-100 text-yellow-800' };
  return { text: 'Available', color: 'bg-green-100 text-green-800' };
}

export default async function BullDetailPage({ params }: PageProps) {
  const bull = await getBull(params.slug);

  if (!bull) {
    notFound();
  }

  // Check if current user has favorited this bull
  const session = await auth();
  let isFavorited = false;
  
  if (session?.user?.id) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_bullId: {
          userId: session.user.id,
          bullId: bull.id,
        },
      },
    });
    isFavorited = !!favorite;
  }

  const availability = getAvailabilityStatus(bull.availableStraws);
  const age = calculateAge(bull.birthDate);
  const epdData = bull.epdData as any;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href="/bulls" className="hover:text-gray-700">Bulls</Link>
            <span>/</span>
            <span className="text-gray-900">{bull.name}</span>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
              {/* Hero Image */}
              <div className="relative h-96 bg-gray-200">
                {bull.heroImage ? (
                  <Image
                    src={bull.heroImage}
                    alt={bull.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-300 to-gray-400">
                    <svg className="w-32 h-32 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Availability Badge */}
              <div className="p-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${availability.color}`}>
                  {availability.text}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{bull.name}</h1>
                <div className="flex items-center gap-3">
                  <FavoriteButton bullId={bull.id} initialIsFavorited={isFavorited} size="lg" />
                  <ShareButton />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p className="text-lg font-medium text-gray-900">{bull.registrationNumber || 'Not Available'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Breed</p>
                  <p className="text-lg font-medium text-gray-900">{bull.breed}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Born</p>
                  <p className="text-lg font-medium text-gray-900">{bull.birthDate ? formatDate(bull.birthDate) : 'Not Available'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-lg font-medium text-gray-900">{age}</p>
                </div>
              </div>

              {/* Ranch Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Ranch</p>
                <Link 
                  href={`/ranch/${bull.ranch.slug}`}
                  className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                >
                  {bull.ranch.name}
                </Link>
                <div className="flex items-center mt-1 text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">{bull.ranch.state}</span>
                </div>
              </div>
            </div>

            {/* EPD Data */}
            {epdData && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Expected Progeny Differences (EPDs)</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trait</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {epdData.birthWeight !== undefined && (
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Birth Weight</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{epdData.birthWeight > 0 ? '+' : ''}{epdData.birthWeight}</td>
                        </tr>
                      )}
                      {epdData.weaningWeight !== undefined && (
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Weaning Weight</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{epdData.weaningWeight > 0 ? '+' : ''}{epdData.weaningWeight}</td>
                        </tr>
                      )}
                      {epdData.yearlingWeight !== undefined && (
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Yearling Weight</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{epdData.yearlingWeight > 0 ? '+' : ''}{epdData.yearlingWeight}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pedigree */}
            {(bull.sireName || bull.damName || bull.notableAncestors.length > 0) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pedigree</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bull.sireName && (
                    <div>
                      <p className="text-sm text-gray-500">Sire</p>
                      <p className="text-lg font-medium text-gray-900">{bull.sireName}</p>
                    </div>
                  )}
                  
                  {bull.damName && (
                    <div>
                      <p className="text-sm text-gray-500">Dam</p>
                      <p className="text-lg font-medium text-gray-900">{bull.damName}</p>
                    </div>
                  )}
                </div>

                {bull.notableAncestors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Notable Ancestors</p>
                    <ul className="list-disc list-inside space-y-1">
                      {bull.notableAncestors.map((ancestor, index) => (
                        <li key={index} className="text-gray-700">{ancestor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Performance Data */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Data</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {bull.birthWeight && (
                  <div>
                    <p className="text-sm text-gray-500">Birth Weight</p>
                    <p className="text-lg font-medium text-gray-900">{bull.birthWeight} lbs</p>
                  </div>
                )}
                
                {bull.weaningWeight && (
                  <div>
                    <p className="text-sm text-gray-500">Weaning Weight</p>
                    <p className="text-lg font-medium text-gray-900">{bull.weaningWeight} lbs</p>
                  </div>
                )}
                
                {bull.yearlingWeight && (
                  <div>
                    <p className="text-sm text-gray-500">Yearling Weight</p>
                    <p className="text-lg font-medium text-gray-900">{bull.yearlingWeight} lbs</p>
                  </div>
                )}
              </div>

              {bull.progenyNotes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Progeny Notes</p>
                  <p className="text-gray-700">{bull.progenyNotes}</p>
                </div>
              )}
            </div>

            {/* Inventory & Pricing */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Availability & Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Available Straws</p>
                  <p className="text-2xl font-bold text-gray-900">{bull.availableStraws}</p>
                </div>
                
                {bull.pricePerStraw && (
                  <div>
                    <p className="text-sm text-gray-500">Price per Straw</p>
                    <p className="text-2xl font-bold text-gray-900">${bull.pricePerStraw}</p>
                  </div>
                )}
              </div>

              {/* Contact Ranch Button */}
              <div className="mt-6">
                <Link
                  href={`/ranch/${bull.ranch.slug}`}
                  className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                >
                  Contact Ranch for Inquiry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const bull = await getBull(params.slug);
  
  if (!bull) {
    return {
      title: 'Bull Not Found',
    };
  }

  return {
    title: `${bull.name} - ${bull.breed} Bull | BeefStore`,
    description: `View detailed information about ${bull.name}, a ${bull.breed} bull from ${bull.ranch.name}. Registration: ${bull.registrationNumber || 'N/A'}`,
  };
}
