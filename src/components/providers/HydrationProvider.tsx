'use client';

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { ReactNode } from 'react';

interface HydrationProviderProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export default function HydrationProvider({ children, queryClient }: HydrationProviderProps) {
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
} 