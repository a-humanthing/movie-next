# React Query (TanStack Query) Implementation

This project uses React Query for efficient data fetching, caching, and state management with SSR support.

## Architecture Overview

### 1. Query Client Configuration (`src/lib/query-client.ts`)
- Centralized query client configuration
- Optimized settings for SSR
- Smart retry logic (no retries for 4xx errors)
- Disabled refetch on window focus for better UX

### 2. Providers (`src/components/providers/`)
- **QueryProvider**: Wraps the app with React Query context
- **HydrationProvider**: Handles SSR hydration

### 3. Custom Hooks (`src/hooks/`)

#### Movie Hooks (`useMovies.ts`)
- `useMovies(params)`: Fetch paginated movies with caching
- `useMovie(id)`: Fetch single movie with longer cache time
- `useCreateMovie()`: Create new movie with cache invalidation
- `useUpdateMovie()`: Update movie with optimistic updates
- `useDeleteMovie()`: Delete movie with cache cleanup

#### Authentication Hooks (`useAuth.ts`)
- `useAuth()`: Get current user from cache
- `useUserProfile()`: Fetch user profile from API
- `useLogin()`: Login with cache updates
- `useLogout()`: Logout with cache cleanup

#### File Upload Hooks (`useFileUpload.ts`)
- `useGetSignedUrl()`: Get S3 signed URL for uploads
- `useDeleteFile()`: Delete files from S3
- `uploadFileToS3()`: Utility for S3 uploads

### 4. Query Keys Structure
```typescript
// Movies
movieKeys.all = ['movies']
movieKeys.lists() = ['movies', 'list']
movieKeys.list(params) = ['movies', 'list', { page: 1, limit: 10 }]
movieKeys.details() = ['movies', 'detail']
movieKeys.detail(id) = ['movies', 'detail', 'movie-id']

// Auth
authKeys.user = ['auth', 'user']
authKeys.profile = ['auth', 'profile']
```

## Caching Strategy

### Stale Time Configuration
- **Movies List**: 5 minutes (frequently changing)
- **Single Movie**: 10 minutes (less frequently changing)
- **User Profile**: 10 minutes (user data)
- **Auth Status**: 5 minutes (session data)

### Garbage Collection Time
- **Movies List**: 10 minutes
- **Single Movie**: 30 minutes
- **User Profile**: 30 minutes
- **Auth Status**: 10 minutes

## SSR Support

### Prefetching (`src/lib/prefetch.ts`)
```typescript
// Prefetch movies for homepage
await prefetchMovies({ page: 1, limit: 10 });

// Prefetch single movie for detail page
await prefetchMovie(movieId);

// Prefetch user profile
await prefetchUserProfile();
```

### Hydration
The app uses `HydrationBoundary` to properly hydrate server-side data on the client.

## Usage Examples

### Fetching Movies
```typescript
const { data: movies, isLoading, error } = useMovies({
  page: 1,
  limit: 10
});
```

### Creating a Movie
```typescript
const createMovie = useCreateMovie();

const handleSubmit = async (movieData) => {
  await createMovie.mutateAsync(movieData);
  // Cache is automatically invalidated
};
```

### Optimistic Updates
```typescript
const updateMovie = useUpdateMovie();

const handleUpdate = async (id, updates) => {
  await updateMovie.mutateAsync({ id, movie: updates });
  // Cache is updated immediately
};
```

## Error Handling

- Automatic retry for network errors (max 3 attempts)
- No retry for 4xx errors (client errors)
- Graceful error states in components
- Error boundaries for unexpected errors

## Performance Optimizations

1. **Stale-While-Revalidate**: Data is shown immediately if available, then updated in background
2. **Background Refetching**: Data is refreshed when user reconnects
3. **Smart Caching**: Different cache times for different data types
4. **Query Deduplication**: Multiple components requesting same data share one request
5. **Automatic Garbage Collection**: Old data is cleaned up automatically

## DevTools

React Query DevTools are included in development mode for debugging:
- Query cache inspection
- Mutation history
- Performance monitoring
- Cache manipulation

## Best Practices

1. **Use Query Keys Consistently**: Follow the established key structure
2. **Handle Loading States**: Always show loading indicators
3. **Error Boundaries**: Wrap components with error boundaries
4. **Optimistic Updates**: Use for better UX where appropriate
5. **Cache Invalidation**: Invalidate related queries after mutations
6. **SSR Prefetching**: Prefetch critical data on the server

