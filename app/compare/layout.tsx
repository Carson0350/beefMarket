'use client';

import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { ReactNode } from 'react';

export default function CompareLayout({ children }: { children: ReactNode }) {
  return <ComparisonProvider>{children}</ComparisonProvider>;
}
