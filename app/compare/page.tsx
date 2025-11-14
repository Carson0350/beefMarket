'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useComparison } from '@/contexts/ComparisonContext';
import BullComparisonColumn from '@/components/BullComparisonColumn';
import ComparisonTable from '@/components/ComparisonTable';

export default function ComparePage() {
  const { selectedBulls, removeBull, isHydrated } = useComparison();
  const router = useRouter();
  const [bulls, setBulls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for hydration before checking
    if (!isHydrated) {
      return;
    }

    // Redirect if no bulls selected
    if (selectedBulls.length === 0) {
      router.push('/bulls');
      return;
    }

    // Fetch bull data
    async function fetchBulls() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/bulls/compare?ids=${selectedBulls.join(',')}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch bulls');
        }
        
        const data = await res.json();
        setBulls(data);
      } catch (err) {
        console.error('Error fetching bulls:', err);
        setError('Failed to load bulls for comparison');
      } finally {
        setLoading(false);
      }
    }

    fetchBulls();
  }, [selectedBulls, router, isHydrated]);

  const handleRemove = (bullId: string) => {
    removeBull(bullId);
    // If only one bull left after removal, redirect to browse
    if (selectedBulls.length <= 1) {
      router.push('/bulls');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/bulls"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Back to Browse Bulls
          </Link>
        </div>
      </div>
    );
  }

  if (bulls.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Compare Bulls</h1>
              <p className="mt-1 text-sm text-gray-600">
                Comparing {bulls.length} {bulls.length === 1 ? 'bull' : 'bulls'} side-by-side
              </p>
            </div>
            <div className="flex gap-3">
              {bulls.length < 3 && (
                <Link
                  href="/bulls"
                  className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[48px] flex items-center justify-center"
                >
                  + Add Bull
                </Link>
              )}
              <Link
                href="/bulls"
                className="px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors min-h-[48px] flex items-center justify-center"
              >
                Back to Browse
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bull Columns */}
        <div className={`grid gap-6 mb-8 ${
          bulls.length === 2 ? 'sm:grid-cols-2' : bulls.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-1'
        }`}>
          {bulls.map((bull) => (
            <BullComparisonColumn
              key={bull.id}
              bull={bull}
              onRemove={() => handleRemove(bull.id)}
            />
          ))}
        </div>

        {/* Comparison Tables */}
        <ComparisonTable bulls={bulls} />

        {/* Print Styling */}
        <style jsx global>{`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              background: white !important;
            }
            .bg-gray-50 {
              background: white !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
