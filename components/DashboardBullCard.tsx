'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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

interface DashboardBullCardProps {
  bull: Bull;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DashboardBullCard({ bull, onArchive, onUnarchive, onDelete }: DashboardBullCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusColor = () => {
    if (bull.archived) {
      return 'bg-gray-100 text-gray-800';
    }
    switch (bull.status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    if (bull.archived) return 'ARCHIVED';
    return bull.status;
  };

  const getAvailabilityColor = (straws: number) => {
    if (straws === 0) return 'text-red-600';
    if (straws < 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Status Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Hero Image */}
      <Link href={`/bulls/${bull.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={bull.heroImage}
            alt={bull.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4">
        <Link href={`/bulls/${bull.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-1">
            {bull.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">{bull.breed}</p>
        
        {/* Semen Count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Available Straws:</span>
          <span className={`text-sm font-semibold ${getAvailabilityColor(bull.availableStraws)}`}>
            {bull.availableStraws}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/bulls/${bull.slug}/edit`}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 text-center"
          >
            Edit
          </Link>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                  {!bull.archived ? (
                    <button
                      onClick={() => {
                        onArchive(bull.id);
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onUnarchive(bull.id);
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Unarchive
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Bull?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to permanently delete {bull.name}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(bull.id);
                  setShowDeleteConfirm(false);
                }}
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
