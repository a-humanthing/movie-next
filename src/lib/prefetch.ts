import { getQueryClient } from './query-client';
import { movieKeys } from '@/hooks/useMovies';
import { apiClient } from './api';
import { PaginationParams } from '@/types/api';

// Prefetch movies for SSR
export async function prefetchMovies(params?: PaginationParams) {
  const queryClient = getQueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: movieKeys.list(params || {}),
    queryFn: () => apiClient.getMovies(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Prefetch a single movie for SSR
export async function prefetchMovie(id: string) {
  const queryClient = getQueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => apiClient.getMovie(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Prefetch user profile for SSR
export async function prefetchUserProfile() {
  const queryClient = getQueryClient();
  
  if (apiClient.isAuthenticated()) {
    await queryClient.prefetchQuery({
      queryKey: ['auth', 'profile'],
      queryFn: () => apiClient.getProfile(),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }
} 