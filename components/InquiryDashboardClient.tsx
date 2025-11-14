'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface Bull {
  id: string;
  name: string;
  slug: string;
  heroImage: string | null;
}

interface Inquiry {
  id: string;
  bullId: string;
  breederName: string;
  breederEmail: string;
  breederPhone: string | null;
  message: string;
  status: 'UNREAD' | 'RESPONDED' | 'ARCHIVED';
  internalNotes: string | null;
  respondedAt: Date | null;
  createdAt: Date;
  bull: Bull;
}

interface InquiryDashboardClientProps {
  inquiries: Inquiry[];
  counts: {
    unread: number;
    responded: number;
    archived: number;
    total: number;
  };
  currentStatus?: string;
}

export default function InquiryDashboardClient({
  inquiries: initialInquiries,
  counts: initialCounts,
  currentStatus,
}: InquiryDashboardClientProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [counts, setCounts] = useState(initialCounts);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null);

  const statusTabs = [
    { label: 'All', value: undefined, count: counts.total },
    { label: 'Unread', value: 'UNREAD', count: counts.unread },
    { label: 'Responded', value: 'RESPONDED', count: counts.responded },
    { label: 'Archived', value: 'ARCHIVED', count: counts.archived },
  ];

  const handleStatusChange = (status?: string) => {
    if (status) {
      router.push(`/dashboard/inquiries?status=${status}`);
    } else {
      router.push('/dashboard/inquiries');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: 'RESPONDED' | 'ARCHIVED' | 'UNREAD') => {
    setUpdatingId(inquiryId);
    
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update inquiry');
      }

      const { inquiry: updatedInquiry } = await response.json();

      // Update local state
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === inquiryId ? updatedInquiry : inq))
      );

      // Update counts
      const oldInquiry = inquiries.find((inq) => inq.id === inquiryId);
      if (oldInquiry) {
        setCounts((prev) => {
          const newCounts = { ...prev };
          
          // Decrease old status count
          if (oldInquiry.status === 'UNREAD') newCounts.unread--;
          else if (oldInquiry.status === 'RESPONDED') newCounts.responded--;
          else if (oldInquiry.status === 'ARCHIVED') newCounts.archived--;
          
          // Increase new status count
          if (newStatus === 'UNREAD') newCounts.unread++;
          else if (newStatus === 'RESPONDED') newCounts.responded++;
          else if (newStatus === 'ARCHIVED') newCounts.archived++;
          
          return newCounts;
        });
      }

      // Refresh the page to update the filtered list
      router.refresh();
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Failed to update inquiry. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const saveNotes = async (inquiryId: string) => {
    setSavingNotesId(inquiryId);
    
    try {
      const notes = notesById[inquiryId] || '';
      
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNotes: notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      const { inquiry: updatedInquiry } = await response.json();

      // Update local state
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === inquiryId ? updatedInquiry : inq))
      );

      alert('Notes saved successfully!');
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes. Please try again.');
    } finally {
      setSavingNotesId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNREAD':
        return 'bg-blue-100 text-blue-800';
      case 'RESPONDED':
        return 'bg-green-100 text-green-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateMessage = (message: string, length: number = 100) => {
    if (message.length <= length) return message;
    return message.substring(0, length) + '...';
  };

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleStatusChange(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStatus === tab.value || (!currentStatus && !tab.value)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white bg-opacity-30">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {inquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No inquiries yet
          </h3>
          <p className="text-gray-600">
            When breeders inquire about your bulls, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => {
            const currentNotes = notesById[inquiry.id] ?? inquiry.internalNotes ?? '';
            
            return (
              <div
                key={inquiry.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Inquiry Card Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleExpand(inquiry.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Bull Thumbnail */}
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      {inquiry.bull.heroImage ? (
                        <Image
                          src={inquiry.bull.heroImage}
                          alt={inquiry.bull.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                          <svg
                            className="w-8 h-8 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Inquiry Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {inquiry.bull.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            From: {inquiry.breederName}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            inquiry.status
                          )}`}
                        >
                          {inquiry.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-2">
                        {expandedId === inquiry.id
                          ? inquiry.message
                          : truncateMessage(inquiry.message)}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {format(new Date(inquiry.createdAt), 'MMM d, yyyy h:mm a')}
                        </p>
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          {expandedId === inquiry.id ? 'Show less' : 'Show more'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === inquiry.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-6">
                    {/* Bull Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Bull Details
                      </h4>
                      <Link
                        href={`/bulls/${inquiry.bull.slug}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View {inquiry.bull.name} →
                      </Link>
                    </div>

                    {/* Breeder Contact */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Breeder Contact
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700">
                          <span className="font-medium">Name:</span>{' '}
                          {inquiry.breederName}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span>{' '}
                          <a
                            href={`mailto:${inquiry.breederEmail}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {inquiry.breederEmail}
                          </a>
                        </p>
                        {inquiry.breederPhone && (
                          <p className="text-gray-700">
                            <span className="font-medium">Phone:</span>{' '}
                            <a
                              href={`tel:${inquiry.breederPhone}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {inquiry.breederPhone}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Internal Notes
                      </h4>
                      <textarea
                        value={currentNotes}
                        onChange={(e) =>
                          setNotesById((prev) => ({
                            ...prev,
                            [inquiry.id]: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        rows={3}
                        placeholder="Add private notes about this inquiry..."
                        maxLength={1000}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {currentNotes.length}/1000 characters
                        </p>
                        <button
                          onClick={() => saveNotes(inquiry.id)}
                          disabled={savingNotesId === inquiry.id}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 disabled:bg-gray-400"
                        >
                          {savingNotesId === inquiry.id ? 'Saving...' : 'Save Notes'}
                        </button>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Status Actions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {inquiry.status === 'UNREAD' && (
                          <button
                            onClick={() => updateInquiryStatus(inquiry.id, 'RESPONDED')}
                            disabled={updatingId === inquiry.id}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-gray-400"
                          >
                            {updatingId === inquiry.id ? 'Updating...' : 'Mark as Responded'}
                          </button>
                        )}
                        {inquiry.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => updateInquiryStatus(inquiry.id, 'ARCHIVED')}
                            disabled={updatingId === inquiry.id}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium disabled:bg-gray-400"
                          >
                            {updatingId === inquiry.id ? 'Updating...' : 'Archive'}
                          </button>
                        )}
                        {inquiry.status !== 'UNREAD' && (
                          <button
                            onClick={() => updateInquiryStatus(inquiry.id, 'UNREAD')}
                            disabled={updatingId === inquiry.id}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400"
                          >
                            {updatingId === inquiry.id ? 'Updating...' : 'Reopen'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Contact Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Contact Actions
                      </h4>
                      <div className="flex gap-3">
                        <a
                          href={`mailto:${inquiry.breederEmail}?subject=Re: Inquiry about ${inquiry.bull.name}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Reply via Email
                        </a>
                        {inquiry.breederPhone && (
                          <a
                            href={`tel:${inquiry.breederPhone}`}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Call Breeder
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Responded At */}
                    {inquiry.respondedAt && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Responded on: {format(new Date(inquiry.respondedAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
