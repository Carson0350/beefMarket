'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useComparison } from '@/contexts/ComparisonContext';
import FavoriteButton from './FavoriteButton';

interface BullCardProps {
  bull: {
    id: string;
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
  isFavorited?: boolean;
}

export default function BullCard({ bull, isFavorited = false }: BullCardProps) {
  const { isSelected, addBull, removeBull, canAddMore } = useComparison();
  const selected = isSelected(bull.id);
  const checkboxDisabled = !selected && !canAddMore;

  // Determine availability status
  const getAvailabilityStatus = (straws: number) => {
    if (straws === 0) return { text: 'Sold Out', color: 'bg-red-100 text-red-800' };
    if (straws < 10) return { text: 'Limited', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const availability = getAvailabilityStatus(bull.availableStraws);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.checked) {
      addBull(bull.id);
    } else {
      removeBull(bull.id);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col relative">
      {/* Comparison Checkbox */}
      <div className="absolute top-3 left-3 z-10" onClick={handleCheckboxClick}>
        <label className="flex items-center cursor-pointer bg-white rounded-md px-2 py-1 shadow-md hover:bg-gray-50">
          <input
            type="checkbox"
            checked={selected}
            disabled={checkboxDisabled}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="ml-1.5 text-xs font-medium text-gray-700">Compare</span>
        </label>
      </div>

      <Link href={`/bulls/${bull.slug}`} className="flex-1 flex flex-col">
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
          
          {/* Availability Badge and Favorite Button */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${availability.color}`}>
              {availability.text}
            </span>
            <div className="bg-white rounded-full p-1.5 shadow-md" onClick={(e) => e.stopPropagation()}>
              <FavoriteButton bullId={bull.id} initialIsFavorited={isFavorited} size="sm" />
            </div>
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
            <span className="text-sm text-gray-600">
              {bull.ranch.name}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
