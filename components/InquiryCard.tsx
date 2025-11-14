'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { EnvelopeIcon, PhoneIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface Inquiry {
  id: string;
  bullId: string;
  breederName: string;
  breederEmail: string;
  breederPhone?: string | null;
  message: string;
  status: string;
  createdAt: Date;
  respondedAt?: Date | null;
  internalNotes?: string | null;
  bull: {
    id: string;
    name: string;
    slug: string;
    heroImage?: string | null;
  };
}

interface InquiryCardProps {
  inquiry: Inquiry;
  onUpdate?: () => void;
}

export default function InquiryCard({ inquiry, onUpdate }: InquiryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [internalNotes, setInternalNotes] = useState(inquiry.internalNotes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Format date
  const relativeTime = formatDistanceToNow(new Date(inquiry.createdAt), {
    addSuffix: true,
  });

  const fullDate = new Date(inquiry.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Truncate message for preview
  const messagePreview =
    inquiry.message.length > 100
      ? inquiry.message.substring(0, 100) + '...'
      : inquiry.message;

  // Format responded date if exists
  const respondedDate = inquiry.respondedAt
    ? new Date(inquiry.respondedAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  // Update inquiry status
  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Trigger parent refresh
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update inquiry status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Save internal notes
  const saveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const response = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      // Trigger parent refresh
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Create mailto link for reply
  const mailtoLink = `mailto:${inquiry.breederEmail}?subject=Re: Inquiry about ${inquiry.bull.name}&body=Hi ${inquiry.breederName},%0D%0A%0D%0AThank you for your inquiry about ${inquiry.bull.name}.%0D%0A%0D%0A`;

  return (
    <div className="hover:bg-gray-50 transition-colors">
      {/* Collapsed View */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left"
      >
        <div className="flex items-start space-x-4">
          {/* Bull Thumbnail */}
          <div className="flex-shrink-0">
            {inquiry.bull.heroImage ? (
              <Image
                src={inquiry.bull.heroImage}
                alt={inquiry.bull.name}
                width={100}
                height={75}
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-[100px] h-[75px] bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            )}
          </div>

          {/* Inquiry Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {inquiry.bull.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  From <span className="font-medium">{inquiry.breederName}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">{relativeTime}</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {isExpanded ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Message Preview (when collapsed) */}
            {!isExpanded && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {messagePreview}
              </p>
            )}
          </div>
        </div>
      </button>

      {/* Expanded View */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
          {/* Bull Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Bull Information</h4>
            <Link
              href={`/bulls/${inquiry.bull.slug}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View {inquiry.bull.name} →
            </Link>
          </div>

          {/* Breeder Contact */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Breeder Contact Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-900">{inquiry.breederName}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                <a
                  href={`mailto:${inquiry.breederEmail}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {inquiry.breederEmail}
                </a>
              </div>
              {inquiry.breederPhone && (
                <div className="flex items-center space-x-2 text-sm">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <a
                    href={`tel:${inquiry.breederPhone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {inquiry.breederPhone}
                  </a>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium text-gray-700">Received:</span>
                <span className="text-gray-600">{fullDate}</span>
              </div>
            </div>
          </div>

          {/* Full Message */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Message</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </div>

          {/* Internal Notes */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Internal Notes</h4>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Add private notes about this inquiry..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
              rows={3}
              maxLength={1000}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {internalNotes.length}/1000 characters
              </span>
              <button
                onClick={saveNotes}
                disabled={isSavingNotes || internalNotes === inquiry.internalNotes}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSavingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    inquiry.status === 'UNREAD'
                      ? 'bg-blue-100 text-blue-800'
                      : inquiry.status === 'RESPONDED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {inquiry.status}
                </span>
                {respondedDate && (
                  <p className="text-xs text-gray-600 mt-1">
                    Responded: {respondedDate}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <a
                href={mailtoLink}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Reply via Email
              </a>

              {inquiry.status === 'UNREAD' && (
                <button
                  onClick={() => updateStatus('RESPONDED')}
                  disabled={isUpdating}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? 'Updating...' : 'Mark as Responded'}
                </button>
              )}

              {inquiry.status !== 'ARCHIVED' && (
                <button
                  onClick={() => updateStatus('ARCHIVED')}
                  disabled={isUpdating}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? 'Updating...' : 'Archive'}
                </button>
              )}

              {inquiry.status === 'RESPONDED' && (
                <button
                  onClick={() => updateStatus('UNREAD')}
                  disabled={isUpdating}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? 'Updating...' : 'Mark as Unread'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
