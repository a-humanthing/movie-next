import { create } from 'zustand';
import {
  MovieResponseDto,
  CreateMovieDto,
  UpdateMovieDto,
  PaginatedMoviesResponseDto,
  PaginationParams,
} from '@/types/api';
import { apiClient } from '@/lib/api';

interface MoviesState {
  movies: MovieResponseDto[];
  currentMovie: MovieResponseDto | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
}

interface MoviesActions {
  // Fetch movies
  fetchMovies: (params?: PaginationParams) => Promise<void>;
  
  // CRUD operations
  createMovie: (movie: CreateMovieDto) => Promise<MovieResponseDto>;
  updateMovie: (id: string, movie: UpdateMovieDto) => Promise<MovieResponseDto>;
  
  // State management
  setCurrentMovie: (movie: MovieResponseDto | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetState: () => void;
}

type MoviesStore = MoviesState & MoviesActions;

const initialState: MoviesState = {
  movies: [],
  currentMovie: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
};

export const useMoviesStore = create<MoviesStore>((set, get) => ({
  ...initialState,

  fetchMovies: async (params?: PaginationParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getMovies(params);
      set({
        movies: response.movies,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch movies',
      });
    }
  },

  createMovie: async (movie: CreateMovieDto) => {
    set({ isCreating: true, error: null });
    try {
      const newMovie = await apiClient.createMovie(movie);
      
      // Add to current list
      set((state) => ({
        movies: [newMovie, ...state.movies],
        isCreating: false,
      }));
      
      return newMovie;
    } catch (error: any) {
      set({
        isCreating: false,
        error: error.response?.data?.message || 'Failed to create movie',
      });
      throw error;
    }
  },

  updateMovie: async (id: string, movie: UpdateMovieDto) => {
    set({ isUpdating: true, error: null });
    try {
      const updatedMovie = await apiClient.updateMovie(id, movie);
      
      // Update in current list
      set((state) => ({
        movies: state.movies.map((m) => 
          m._id === id ? updatedMovie : m
        ),
        currentMovie: state.currentMovie?._id === id ? updatedMovie : state.currentMovie,
        isUpdating: false,
      }));
      
      return updatedMovie;
    } catch (error: any) {
      set({
        isUpdating: false,
        error: error.response?.data?.message || 'Failed to update movie',
      });
      throw error;
    }
  },

  setCurrentMovie: (movie: MovieResponseDto | null) => {
    set({ currentMovie: movie });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  resetState: () => {
    set(initialState);
  },
})); 