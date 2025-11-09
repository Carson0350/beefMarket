'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface Bull {
  id: string;
  slug: string;
  name: string;
  breed: string;
  status: 'DRAFT' | 'PUBLISHED';
  archived: boolean;
  heroImage: string | null;
  semenAvailable: number | null;
  createdAt: string;
}

interface Stats {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

interface Ranch {
  name: string;
  slug: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  const [bulls, setBulls] = useState<Bull[]>([]);
  const [filteredBulls, setFilteredBulls] = useState<Bull[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, draft: 0, archived: 0 });
  const [ranch, setRanch] = useState<Ranch | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [archiveConfirm, setArchiveConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (!session.user?.emailVerified) {
      router.push('/check-email');
      return;
    }

    // Check for success messages
    const success = searchParams.get('success');
    if (success === 'bull-published') {
      const url = searchParams.get('url');
      setSuccessMessage(`Bull published successfully! ${url ? `Share: ${url}` : ''}`);
    } else if (success === 'bull-draft-saved') {
      setSuccessMessage('Bull saved as draft');
    } else if (success === 'bull-updated') {
      setSuccessMessage('Bull updated successfully');
    }

    fetchBulls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  useEffect(() => {
    // Filter bulls based on selected filter and search query
    let filtered = bulls;

    // Apply status filter
    if (filter === 'published') {
      filtered = bulls.filter(b => b.status === 'PUBLISHED' && !b.archived);
    } else if (filter === 'draft') {
      filtered = bulls.filter(b => b.status === 'DRAFT');
    } else if (filter === 'archived') {
      filtered = bulls.filter(b => b.archived);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(query) || 
        b.breed.toLowerCase().includes(query)
      );
    }

    setFilteredBulls(filtered);
  }, [bulls, filter, searchQuery]);

  const fetchBulls = async () => {
    try {
      const response = await fetch('/api/ranch/bulls');
      const data = await response.json();
      
      if (data.success) {
        setBulls(data.bulls);
        setStats(data.stats);
        setRanch(data.ranch);
      }
    } catch (error) {
      console.error('Failed to fetch bulls:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyRanchUrl = () => {
    if (ranch) {
      const url = `${window.location.origin}/ranch/${ranch.slug}`;
      navigator.clipboard.writeText(url);
      setSuccessMessage('Ranch URL copied to clipboard!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleArchive = async (slug: string, isArchived: boolean) => {
    try {
      const response = await fetch(`/api/bulls/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: !isArchived }),
      });

      if (response.ok) {
        setSuccessMessage(isArchived ? 'Bull unarchived' : 'Bull archived');
        fetchBulls();
        setArchiveConfirm(null);
      }
    } catch (error) {
      console.error('Archive error:', error);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      const response = await fetch(`/api/bulls/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage('Bull deleted successfully');
        fetchBulls();
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {ranch?.name || 'Ranch Dashboard'}
              </h1>
              {ranch && (
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {window.location.origin}/ranch/{ranch.slug}
                  </span>
                  <button
                    onClick={copyRanchUrl}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Copy Link
                  </button>
                  <Link
                    href="/dashboard/ranch/edit"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit Ranch Profile
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/bulls/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              + Add New Bull
            </Link>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Bulls</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-900">{stats.published}</div>
              <div className="text-sm text-green-700">Active Listings</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-900">{stats.draft}</div>
              <div className="text-sm text-yellow-700">Drafts</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-700">{stats.archived}</div>
              <div className="text-sm text-gray-600">Archived</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'published'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'draft'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'archived'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Archived
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
        </div>

        {/* Bulls Grid */}
        {filteredBulls.length === 0 ? (
          <div className="mt-8 text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No bulls found</p>
            {bulls.length === 0 && (
              <Link
                href="/bulls/create"
                className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first bull →
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBulls.map((bull) => (
              <div key={bull.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Bull Image */}
                <div className="relative h-48 bg-gray-200">
                  {bull.heroImage ? (
                    <Image
                      src={bull.heroImage}
                      alt={bull.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No image
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {bull.archived ? (
                      <span className="px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded">
                        Archived
                      </span>
                    ) : bull.status === 'PUBLISHED' ? (
                      <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-medium rounded">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Bull Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{bull.name}</h3>
                  <p className="text-sm text-gray-600">{bull.breed}</p>
                  {bull.semenAvailable !== null && (
                    <p className="mt-2 text-sm text-gray-700">
                      {bull.semenAvailable} straws available
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/bulls/${bull.slug}/edit`}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 text-center"
                    >
                      Edit
                    </Link>
                    
                    {bull.archived ? (
                      <button
                        onClick={() => setArchiveConfirm(bull.slug)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                      >
                        Unarchive
                      </button>
                    ) : (
                      <button
                        onClick={() => setArchiveConfirm(bull.slug)}
                        className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700"
                      >
                        Archive
                      </button>
                    )}
                    
                    <button
                      onClick={() => setDeleteConfirm(bull.slug)}
                      className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Archive Confirmation Modal */}
      {archiveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {bulls.find(b => b.slug === archiveConfirm)?.archived ? 'Unarchive' : 'Archive'} Bull?
            </h3>
            <p className="text-gray-600 mb-4">
              {bulls.find(b => b.slug === archiveConfirm)?.archived
                ? 'This will restore the bull to published status and make it visible on your ranch page.'
                : 'This will hide the bull from your public ranch page but keep it in your dashboard.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setArchiveConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleArchive(archiveConfirm, bulls.find(b => b.slug === archiveConfirm)?.archived || false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Bull?</h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. The bull and all its data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
