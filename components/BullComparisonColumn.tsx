'use client';

import Image from 'next/image';
import Link from 'next/link';

interface BullComparisonColumnProps {
  bull: {
    id: string;
    slug: string;
    name: string;
    breed: string;
    heroImage: string;
    birthDate?: Date | string | null;
    ranch: {
      name: string;
      slug: string;
    };
  };
  onRemove: () => void;
}

export default function BullComparisonColumn({ bull, onRemove }: BullComparisonColumnProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Header with remove button */}
      <div className="relative">
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
          aria-label={`Remove ${bull.name} from comparison`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Hero Image */}
        <Link href={`/bulls/${bull.slug}`}>
          <div className="relative h-64 w-full bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
            {bull.heroImage ? (
              <Image
                src={bull.heroImage}
                alt={bull.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-300 to-gray-400">
                <svg className="w-24 h-24 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </Link>
      </div>
      
      {/* Bull Info */}
      <div className="p-4 border-t border-gray-200">
        <Link href={`/bulls/${bull.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-1">
            {bull.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">{bull.breed}</p>
        <Link href={`/ranch/${bull.ranch.slug}`} className="text-sm text-blue-600 hover:underline">
          {bull.ranch.name}
        </Link>
      </div>
    </div>
  );
}
