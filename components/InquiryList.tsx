'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InquiryCard from './InquiryCard';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface Inquiry {
  id: string;
  bullId: string;
  breederName: string;
  breederEmail: string;
  breederPhone?: string | null;
  message: string;
  status: string;
  createdAt: Date;
  bull: {
    id: string;
    name: string;
    slug: string;
    heroImage?: string | null;
  };
}

interface InquiryListProps {
  groupedInquiries: {
    UNREAD: Inquiry[];
    RESPONDED: Inquiry[];
    ARCHIVED: Inquiry[];
  };
  statusCounts: {
    UNREAD: number;
    RESPONDED: number;
    ARCHIVED: number;
  };
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export default function InquiryList({
  groupedInquiries,
  statusCounts,
  totalCount,
  currentPage,
  pageSize,
}: InquiryListProps) {
  const router = useRouter();
  
  // State for expanded/collapsed status groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    UNREAD: true, // Unread expanded by default
    RESPONDED: false,
    ARCHIVED: false,
  });

  // Handle inquiry updates (refresh page data)
  const handleInquiryUpdate = () => {
    router.refresh();
  };

  const toggleGroup = (status: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const statusConfig = {
    UNREAD: {
      label: 'Unread',
      color: 'bg-blue-100 text-blue-800',
      borderColor: 'border-blue-200',
    },
    RESPONDED: {
      label: 'Responded',
      color: 'bg-green-100 text-green-800',
      borderColor: 'border-green-200',
    },
    ARCHIVED: {
      label: 'Archived',
      color: 'bg-gray-100 text-gray-800',
      borderColor: 'border-gray-200',
    },
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  if (totalCount === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Inquiries Yet
        </h3>
        <p className="text-gray-600">
          When breeders submit inquiries about your bulls, they&apos;ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Groups */}
      {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
        const config = statusConfig[status];
        const inquiries = groupedInquiries[status];
        const count = statusCounts[status];
        const isExpanded = expandedGroups[status];

        return (
          <div key={status} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(status)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
                  {config.label}
                </span>
                <span className="text-gray-600 text-sm">
                  {count} {count === 1 ? 'inquiry' : 'inquiries'}
                </span>
              </div>
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {/* Group Content */}
            {isExpanded && (
              <div className="border-t border-gray-200">
                {inquiries.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No {config.label.toLowerCase()} inquiries
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {inquiries.map((inquiry) => (
                      <InquiryCard 
                        key={inquiry.id} 
                        inquiry={inquiry}
                        onUpdate={handleInquiryUpdate}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-md px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount} inquiries
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={`?page=${currentPage - 1}`}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  hasPrevPage
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                aria-disabled={!hasPrevPage}
              >
                Previous
              </a>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <a
                href={`?page=${currentPage + 1}`}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  hasNextPage
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                aria-disabled={!hasNextPage}
              >
                Next
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
