import { Suspense } from 'react';
import BullCard from '@/components/BullCard';
import Pagination from '@/components/Pagination';

interface PageProps {
  searchParams: { page?: string };
}

async function fetchBulls(page: number) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  const res = await fetch(`${baseUrl}/api/bulls/public?page=${page}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch bulls');
  }

  return res.json();
}

function BullsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-64 bg-gray-300" />
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="h-4 bg-gray-300 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Bulls Available
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        There are currently no bulls listed. Please check back later as ranches add their bulls to the marketplace.
      </p>
    </div>
  );
}

async function BullsGrid({ page }: { page: number }) {
  const data = await fetchBulls(page);

  if (!data.bulls || data.bulls.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.bulls.map((bull: any) => (
          <BullCard key={bull.id} bull={bull} />
        ))}
      </div>

      <Pagination
        currentPage={data.pagination.currentPage}
        totalPages={data.pagination.totalPages}
        hasNextPage={data.pagination.hasNextPage}
        hasPreviousPage={data.pagination.hasPreviousPage}
      />
    </>
  );
}

export default async function BullsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Bulls</h1>
          <p className="mt-2 text-gray-600">
            Discover quality breeding bulls from ranches across the country
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<BullsGridSkeleton />}>
          <BullsGrid page={page} />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Browse Bulls - Wagner Beef',
  description: 'Browse quality breeding bulls from ranches across the country',
};
