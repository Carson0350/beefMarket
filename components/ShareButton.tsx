'use client';

import { useState } from 'react';
import { ShareIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ShareButtonProps {
  url?: string;
  title?: string;
  className?: string;
}

export default function ShareButton({ url, title, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const linkToCopy = url || window.location.href;
    
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopied(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        {copied ? (
          <>
            <CheckIcon className="h-5 w-5 mr-2 text-green-600" />
            <span className="text-green-600">Link Copied!</span>
          </>
        ) : (
          <>
            <ShareIcon className="h-5 w-5 mr-2" />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  );
}
