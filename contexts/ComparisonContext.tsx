'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ComparisonContextType {
  selectedBulls: string[];
  addBull: (bullId: string) => void;
  removeBull: (bullId: string) => void;
  clearComparison: () => void;
  isSelected: (bullId: string) => boolean;
  canAddMore: boolean;
  isHydrated: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_BULLS = 3;
const STORAGE_KEY = 'bull-comparison';

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selectedBulls, setSelectedBulls] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedBulls(parsed);
        }
      } catch (error) {
        console.error('Failed to parse comparison state:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to sessionStorage whenever selection changes
  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedBulls));
    }
  }, [selectedBulls, isHydrated]);

  const addBull = (bullId: string) => {
    setSelectedBulls((prev) => {
      if (prev.length >= MAX_BULLS || prev.includes(bullId)) {
        return prev;
      }
      return [...prev, bullId];
    });
  };

  const removeBull = (bullId: string) => {
    setSelectedBulls((prev) => prev.filter((id) => id !== bullId));
  };

  const clearComparison = () => {
    setSelectedBulls([]);
  };

  const isSelected = (bullId: string) => {
    return selectedBulls.includes(bullId);
  };

  const canAddMore = selectedBulls.length < MAX_BULLS;

  return (
    <ComparisonContext.Provider
      value={{
        selectedBulls,
        addBull,
        removeBull,
        clearComparison,
        isSelected,
        canAddMore,
        isHydrated,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
