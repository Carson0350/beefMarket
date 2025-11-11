'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BullThumbnailProps {
  bullId: string;
  onRemove: (bullId: string) => void;
}

interface BullData {
  id: string;
  name: string;
  heroImage: string;
  breed: string;
}

export default function BullThumbnail({ bullId, onRemove }: BullThumbnailProps) {
  const [bull, setBull] = useState<BullData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBullData() {
      try {
        const res = await fetch(`/api/bulls/${bullId}/thumbnail`);
        if (res.ok) {
          const data = await res.json();
          setBull(data);
        }
      } catch (error) {
        console.error('Failed to fetch bull data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBullData();
  }, [bullId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 animate-pulse">
        <div className="w-12 h-12 bg-gray-300 rounded" />
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-20 mb-1" />
          <div className="h-3 bg-gray-300 rounded w-16" />
        </div>
      </div>
    );
  }

  if (!bull) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
      {/* Thumbnail Image */}
      <div className="relative w-12 h-12 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
        {bull.heroImage ? (
          <Image
            src={bull.heroImage}
            alt={bull.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-300">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Bull Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{bull.name}</p>
        <p className="text-xs text-gray-500 truncate">{bull.breed}</p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(bullId)}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        aria-label={`Remove ${bull.name} from comparison`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
