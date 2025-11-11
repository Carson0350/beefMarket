'use client';

import { ReactNode } from 'react';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import ComparisonBar from './ComparisonBar';

export default function BullsPageClient({ children }: { children: ReactNode }) {
  return (
    <ComparisonProvider>
      {children}
      <ComparisonBar />
    </ComparisonProvider>
  );
}
