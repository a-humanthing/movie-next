import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { 
  PaginatedMoviesResponseDto, 
  MovieResponseDto, 
  CreateMovieDto, 
  UpdateMovieDto,
  PaginationParams 
} from '@/types/api';

// Query keys for consistent caching
export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters: PaginationParams) => [...movieKeys.lists(), filters] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: string) => [...movieKeys.details(), id] as const,
};

// Hook for fetching paginated movies
export function useMovies(params?: PaginationParams) {
  return useQuery({
    queryKey: movieKeys.list(params || {}),
    queryFn: () => apiClient.getMovies(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a single movie
export function useMovie(id: string) {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => apiClient.getMovie(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook for creating a movie
export function useCreateMovie() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (movie: CreateMovieDto) => apiClient.createMovie(movie),
    onSuccess: () => {
      // Invalidate and refetch movies list
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
    },
    onError: (error) => {
      console.error('Error creating movie:', error);
    },
  });
}

// Hook for updating a movie
export function useUpdateMovie() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, movie }: { id: string; movie: UpdateMovieDto }) => 
      apiClient.updateMovie(id, movie),
    onSuccess: (updatedMovie) => {
      // Update the specific movie in cache
      queryClient.setQueryData(
        movieKeys.detail(updatedMovie._id),
        updatedMovie
      );
      // Invalidate movies list
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
    },
    onError: (error) => {
      console.error('Error updating movie:', error);
    },
  });
}

// Hook for deleting a movie
export function useDeleteMovie() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteMovie(id),
    onSuccess: (_, deletedId) => {
      // Remove the movie from cache
      queryClient.removeQueries({ queryKey: movieKeys.detail(deletedId) });
      // Invalidate movies list
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
    },
    onError: (error) => {
      console.error('Error deleting movie:', error);
    },
  });
} 