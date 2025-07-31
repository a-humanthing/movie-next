import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { LoginDto, AuthResponseDto, UserProfileDto } from '@/types/api';

// Query keys for authentication
export const authKeys = {
  user: ['auth', 'user'] as const,
  profile: ['auth', 'profile'] as const,
};

// Hook for user authentication status
export function useAuth() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: () => {
      const user = apiClient.getUser();
      if (!user) {
        throw new Error('No user found');
      }
      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });
}

// Hook for user profile
export function useUserProfile() {
  return useQuery({
    queryKey: authKeys.profile,
    queryFn: () => apiClient.getProfile(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: apiClient.isAuthenticated(),
  });
}

// Hook for login
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginDto) => apiClient.login(credentials),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(authKeys.user, data.user);
      queryClient.setQueryData(authKeys.profile, data.user);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
}

// Hook for logout
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: authKeys.user });
      queryClient.removeQueries({ queryKey: authKeys.profile });
      // Clear all movie queries as well
      queryClient.removeQueries({ queryKey: ['movies'] });
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local data
      queryClient.removeQueries({ queryKey: authKeys.user });
      queryClient.removeQueries({ queryKey: authKeys.profile });
      queryClient.removeQueries({ queryKey: ['movies'] });
    },
  });
} 