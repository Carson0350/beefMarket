import Image from 'next/image';
import Link from 'next/link';

interface BullCardProps {
  bull: {
    slug: string;
    name: string;
    breed: string;
    heroImage: string;
    epdData?: any;
    availableStraws: number;
    ranch: {
      name: string;
      slug: string;
    };
  };
}

export default function BullCard({ bull }: BullCardProps) {
  // Determine availability status
  const getAvailabilityStatus = (straws: number) => {
    if (straws === 0) return { text: 'Sold Out', color: 'bg-red-100 text-red-800' };
    if (straws < 10) return { text: 'Limited', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const availability = getAvailabilityStatus(bull.availableStraws);

  // Extract key EPD values
  const getEpdDisplay = () => {
    if (!bull.epdData) return null;
    
    const epd = bull.epdData as any;
    const values = [];
    
    if (epd.birthWeight !== undefined) values.push(`BW: ${epd.birthWeight > 0 ? '+' : ''}${epd.birthWeight}`);
    if (epd.weaningWeight !== undefined) values.push(`WW: ${epd.weaningWeight > 0 ? '+' : ''}${epd.weaningWeight}`);
    if (epd.yearlingWeight !== undefined) values.push(`YW: ${epd.yearlingWeight > 0 ? '+' : ''}${epd.yearlingWeight}`);
    
    return values.length > 0 ? values.join(' | ') : null;
  };

  const epdDisplay = getEpdDisplay();

  return (
    <Link href={`/bulls/${bull.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Hero Image */}
        <div className="relative h-64 w-full bg-gray-200">
          {bull.heroImage ? (
            <Image
              src={bull.heroImage}
              alt={bull.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-300 to-gray-400">
              <svg className="w-24 h-24 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Availability Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${availability.color}`}>
              {availability.text}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Bull Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {bull.name}
          </h3>

          {/* Breed */}
          <p className="text-sm text-gray-600 mb-2">
            {bull.breed}
          </p>

          {/* EPD Values */}
          {epdDisplay && (
            <p className="text-xs text-gray-500 mb-3 font-mono">
              {epdDisplay}
            </p>
          )}

          {/* Ranch Name */}
          <div className="mt-auto pt-3 border-t border-gray-200">
            <Link 
              href={`/ranch/${bull.ranch.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              {bull.ranch.name}
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
}
