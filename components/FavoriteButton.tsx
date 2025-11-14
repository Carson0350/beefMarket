'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface FavoriteButtonProps {
  bullId: string;
  initialIsFavorited: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FavoriteButton({
  bullId,
  initialIsFavorited,
  size = 'md',
  className = '',
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      // Redirect to login with return URL
      const currentPath = window.location.pathname;
      router.push(`/login?returnTo=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Optimistic update
    const previousState = isFavorited;
    setIsFavorited(!isFavorited);
    setIsLoading(true);

    try {
      const method = previousState ? 'DELETE' : 'POST';
      const res = await fetch(`/api/favorites/${bullId}`, { method });

      if (!res.ok) {
        throw new Error('Failed to toggle favorite');
      }

      // Trigger revalidation
      router.refresh();
    } catch (error) {
      // Revert on error
      setIsFavorited(previousState);
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isFavorited ? HeartIconSolid : HeartIcon;
  const sizeClass =
    size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      className={`${
        isFavorited ? 'text-red-500' : 'text-gray-400'
      } hover:text-red-600 transition-colors disabled:opacity-50 ${className}`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Icon className={sizeClass} />
    </button>
  );
}
