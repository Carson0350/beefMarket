'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Load search from URL on mount
  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchQuery(search);
  }, [searchParams]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      
      // Reset to page 1 when search changes
      params.delete('page');
      
      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, pathname, router, searchParams]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-md border-gray-300 pl-10 pr-10 py-3 focus:border-blue-500 focus:ring-blue-500 text-base min-h-[48px]"
          placeholder="Search by bull name, registration, or ranch..."
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 min-h-[44px] hover:bg-gray-50 active:bg-gray-100 rounded-r-md"
            aria-label="Clear search"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
