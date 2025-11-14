'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

const BREEDS = ['Angus', 'Red Angus', 'Hereford', 'Charolais', 'Simmental', 'Brahman', 'Limousin', 'Gelbvieh'];

interface BullFiltersProps {
  onFilterChange?: () => void;
}

export default function BullFilters({ onFilterChange }: BullFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mobile drawer state
  const [isOpen, setIsOpen] = useState(false);

  // Filter state
  const [breeds, setBreeds] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [includeNoPriceListings, setIncludeNoPriceListings] = useState(true);
  
  // EPD ranges
  const [minBirthWeight, setMinBirthWeight] = useState<string>('');
  const [maxBirthWeight, setMaxBirthWeight] = useState<string>('');
  const [minWeaningWeight, setMinWeaningWeight] = useState<string>('');
  const [maxWeaningWeight, setMaxWeaningWeight] = useState<string>('');
  const [minYearlingWeight, setMinYearlingWeight] = useState<string>('');
  const [maxYearlingWeight, setMaxYearlingWeight] = useState<string>('');

  // Load filters from URL on mount
  useEffect(() => {
    const breedsParam = searchParams.get('breeds');
    const statesParam = searchParams.get('states');
    const availabilityParam = searchParams.get('availability');
    
    if (breedsParam) setBreeds(breedsParam.split(','));
    if (statesParam) setStates(statesParam.split(','));
    if (availabilityParam) setAvailability(availabilityParam.split(','));
    
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setIncludeNoPriceListings(searchParams.get('includeNoPriceListings') !== 'false');
    
    setMinBirthWeight(searchParams.get('minBirthWeight') || '');
    setMaxBirthWeight(searchParams.get('maxBirthWeight') || '');
    setMinWeaningWeight(searchParams.get('minWeaningWeight') || '');
    setMaxWeaningWeight(searchParams.get('maxWeaningWeight') || '');
    setMinYearlingWeight(searchParams.get('minYearlingWeight') || '');
    setMaxYearlingWeight(searchParams.get('maxYearlingWeight') || '');
  }, [searchParams]);

  // Apply filters to URL
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Remove page when filters change
    params.delete('page');
    
    // Breed filter
    if (breeds.length > 0) {
      params.set('breeds', breeds.join(','));
    } else {
      params.delete('breeds');
    }
    
    // State filter
    if (states.length > 0) {
      params.set('states', states.join(','));
    } else {
      params.delete('states');
    }
    
    // Availability filter
    if (availability.length > 0) {
      params.set('availability', availability.join(','));
    } else {
      params.delete('availability');
    }
    
    // Price filter
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    params.set('includeNoPriceListings', includeNoPriceListings.toString());
    
    // EPD filters
    if (minBirthWeight) params.set('minBirthWeight', minBirthWeight);
    else params.delete('minBirthWeight');
    
    if (maxBirthWeight) params.set('maxBirthWeight', maxBirthWeight);
    else params.delete('maxBirthWeight');
    
    if (minWeaningWeight) params.set('minWeaningWeight', minWeaningWeight);
    else params.delete('minWeaningWeight');
    
    if (maxWeaningWeight) params.set('maxWeaningWeight', maxWeaningWeight);
    else params.delete('maxWeaningWeight');
    
    if (minYearlingWeight) params.set('minYearlingWeight', minYearlingWeight);
    else params.delete('minYearlingWeight');
    
    if (maxYearlingWeight) params.set('maxYearlingWeight', maxYearlingWeight);
    else params.delete('maxYearlingWeight');
    
    router.push(`${pathname}?${params.toString()}`);
    onFilterChange?.();
  }, [
    breeds, states, availability, minPrice, maxPrice, includeNoPriceListings,
    minBirthWeight, maxBirthWeight, minWeaningWeight, maxWeaningWeight,
    minYearlingWeight, maxYearlingWeight, pathname, router, searchParams, onFilterChange
  ]);

  // Debounced apply
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [applyFilters]);

  const clearAllFilters = () => {
    setBreeds([]);
    setStates([]);
    setAvailability([]);
    setMinPrice('');
    setMaxPrice('');
    setIncludeNoPriceListings(true);
    setMinBirthWeight('');
    setMaxBirthWeight('');
    setMinWeaningWeight('');
    setMaxWeaningWeight('');
    setMinYearlingWeight('');
    setMaxYearlingWeight('');
  };

  const toggleBreed = (breed: string) => {
    setBreeds(prev => 
      prev.includes(breed) ? prev.filter(b => b !== breed) : [...prev, breed]
    );
  };

  const toggleState = (state: string) => {
    setStates(prev => 
      prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
    );
  };

  const toggleAvailability = (status: string) => {
    setAvailability(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const activeFilterCount = 
    breeds.length + 
    states.length + 
    availability.length + 
    (minPrice ? 1 : 0) + 
    (maxPrice ? 1 : 0) +
    (minBirthWeight ? 1 : 0) +
    (maxBirthWeight ? 1 : 0) +
    (minWeaningWeight ? 1 : 0) +
    (maxWeaningWeight ? 1 : 0) +
    (minYearlingWeight ? 1 : 0) +
    (maxYearlingWeight ? 1 : 0);

  // Shared filter content component
  const FilterSections = () => (
    <>
      {/* Breed Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Breed</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {BREEDS.map(breed => (
            <label key={breed} className="flex items-center cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={breeds.includes(breed)}
                onChange={() => toggleBreed(breed)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
              />
              <span className="ml-3 text-sm text-gray-700">{breed}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={availability.includes('in-stock')}
              onChange={() => toggleAvailability('in-stock')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
            />
            <span className="ml-3 text-sm text-gray-700">In Stock (≥10 straws)</span>
          </label>
          <label className="flex items-center cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={availability.includes('limited')}
              onChange={() => toggleAvailability('limited')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
            />
            <span className="ml-3 text-sm text-gray-700">Limited (&lt;10 straws)</span>
          </label>
          <label className="flex items-center cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={availability.includes('sold-out')}
              onChange={() => toggleAvailability('sold-out')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
            />
            <span className="ml-3 text-sm text-gray-700">Sold Out</span>
          </label>
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Location (State)</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {US_STATES.map(state => (
            <label key={state} className="flex items-center cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={states.includes(state)}
                onChange={() => toggleState(state)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
              />
              <span className="ml-3 text-sm text-gray-700">{state}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Price per Straw</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm min-h-[44px]"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm min-h-[44px]"
            />
          </div>
          <label className="flex items-center cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={includeNoPriceListings}
              onChange={(e) => setIncludeNoPriceListings(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
            />
            <span className="ml-3 text-sm text-gray-700">Include bulls with no price listed</span>
          </label>
        </div>
      </div>

      {/* EPD Filters */}
      <div>
        <h3 className="font-medium text-gray-900 mb-2">EPD Ranges</h3>
        
        {/* Birth Weight */}
        <div className="mb-3">
          <label className="text-sm text-gray-700 mb-1 block">Birth Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              placeholder="Min"
              value={minBirthWeight}
              onChange={(e) => setMinBirthWeight(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm min-h-[44px]"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Max"
              value={maxBirthWeight}
              onChange={(e) => setMaxBirthWeight(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm min-h-[44px]"
            />
          </div>
        </div>

        {/* Weaning Weight */}
        <div className="mb-3">
          <label className="text-sm text-gray-700 mb-1 block">Weaning Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="1"
              placeholder="Min"
              value={minWeaningWeight}
              onChange={(e) => setMinWeaningWeight(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm min-h-[44px]"
            />
            <input
              type="number"
              step="1"
              placeholder="Max"
              value={maxWeaningWeight}
              onChange={(e) => setMaxWeaningWeight(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm min-h-[44px]"
            />
          </div>
        </div>

        {/* Yearling Weight */}
        <div>
          <label className="text-sm text-gray-700 mb-1 block">Yearling Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="1"
              placeholder="Min"
              value={minYearlingWeight}
              onChange={(e) => setMinYearlingWeight(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm min-h-[44px]"
            />
            <input
              type="number"
              step="1"
              placeholder="Max"
              value={maxYearlingWeight}
              onChange={(e) => setMaxYearlingWeight(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm min-h-[44px]"
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Filter Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100"
      >
        <FunnelIcon className="h-5 w-5 text-gray-600" />
        <span className="font-medium text-gray-900">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </span>
      </button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-lg active:bg-gray-200"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="w-full mb-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
            >
              Clear All Filters
            </button>
          )}
          {/* Filter content for mobile */}
          <div className="space-y-6">
            <FilterSections />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {activeFilterCount}
              </span>
            )}
          </h2>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-6">
          <FilterSections />
        </div>
      </div>
    </>
  );
}
