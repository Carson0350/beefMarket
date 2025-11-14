'use client';

import { useComparison } from '@/contexts/ComparisonContext';
import Link from 'next/link';
import BullThumbnail from './BullThumbnail';

export default function ComparisonBar() {
  const { selectedBulls, removeBull, clearComparison } = useComparison();

  if (selectedBulls.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Selected Bulls */}
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Compare Bulls ({selectedBulls.length}/3)
              </h3>
              <button
                onClick={clearComparison}
                className="text-xs text-gray-500 hover:text-gray-700 underline px-2 py-2 min-h-[44px]"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedBulls.map((bullId) => (
                <BullThumbnail key={bullId} bullId={bullId} onRemove={removeBull} />
              ))}
            </div>
          </div>

          {/* Compare Button */}
          <div className="w-full sm:w-auto flex-shrink-0">
            {selectedBulls.length < 2 ? (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-white font-semibold rounded-lg shadow-md cursor-not-allowed min-h-[48px]"
              >
                Select 2+ Bulls to Compare
              </button>
            ) : (
              <a
                href="/compare"
                className="inline-block w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center no-underline min-h-[48px]"
              >
                Compare {selectedBulls.length} Bulls
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
