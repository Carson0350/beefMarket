'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardBullCard from '@/components/DashboardBullCard';

interface Bull {
  id: string;
  slug: string;
  name: string;
  breed: string;
  heroImage: string;
  status: 'DRAFT' | 'PUBLISHED';
  archived: boolean;
  availableStraws: number;
}

interface Ranch {
  id: string;
  name: string;
  slug: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bulls, setBulls] = useState<Bull[]>([]);
  const [ranch, setRanch] = useState<Ranch | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user.role !== 'RANCH_OWNER') {
      router.push('/');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const [bullsRes, ranchRes] = await Promise.all([
        fetch('/api/bulls/my-bulls'),
        fetch('/api/ranch/my-ranch'),
      ]);

      if (bullsRes.ok) {
        const bullsData = await bullsRes.json();
        setBulls(bullsData.bulls || []);
      }

      if (ranchRes.ok) {
        const ranchData = await ranchRes.json();
        setRanch(ranchData.ranch);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const res = await fetch(`/api/bulls/${id}/archive`, {
        method: 'PATCH',
      });

      if (res.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error archiving bull:', error);
    }
  };

  const handleUnarchive = async (id: string) => {
    try {
      const res = await fetch(`/api/bulls/${id}/unarchive`, {
        method: 'PATCH',
      });

      if (res.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error unarchiving bull:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/bulls/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error deleting bull:', error);
    }
  };

  const copyRanchLink = () => {
    if (ranch) {
      const url = `${window.location.origin}/ranch/${ranch.slug}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const filteredBulls = bulls
    .filter(bull => {
      if (filter === 'all') return true;
      if (filter === 'archived') return bull.archived;
      return bull.status.toLowerCase() === filter && !bull.archived;
    })
    .filter(bull => {
      if (!searchQuery) return true;
      return (
        bull.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bull.breed.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const stats = {
    total: bulls.length,
    published: bulls.filter(b => b.status === 'PUBLISHED' && !b.archived).length,
    draft: bulls.filter(b => b.status === 'DRAFT' && !b.archived).length,
    archived: bulls.filter(b => b.archived).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{ranch?.name || 'My Ranch'}</h1>
              {ranch && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-600">
                    {window.location.origin}/ranch/{ranch.slug}
                  </span>
                  <button
                    onClick={copyRanchLink}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              )}
            </div>
            <Link
              href="/dashboard/ranch/edit"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Edit Ranch Profile
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Bulls</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Archived</p>
              <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'published'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Published ({stats.published})
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'draft'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Drafts ({stats.draft})
              </button>
              <button
                onClick={() => setFilter('archived')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'archived'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Archived ({stats.archived})
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search bulls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
        </div>

        {/* Add New Bull Button */}
        <div className="mb-6">
          <Link
            href="/bulls/create"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Bull
          </Link>
        </div>

        {/* Bulls Grid */}
        {filteredBulls.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'No bulls found matching your search.'
                : filter === 'all'
                ? 'No bulls yet. Create your first bull listing!'
                : `No ${filter} bulls.`}
            </p>
            {!searchQuery && filter === 'all' && (
              <Link
                href="/bulls/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Create First Bull
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBulls.map((bull) => (
              <DashboardBullCard
                key={bull.id}
                bull={bull}
                onArchive={handleArchive}
                onUnarchive={handleUnarchive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
