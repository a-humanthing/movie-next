'use client';

import { useEffect, useState } from 'react';
import { useMoviesStore } from '@/store/movies';
import { MovieResponseDto } from '@/types/api';
import MovieCard from './MovieCard';
import MovieForm from './MovieForm';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MovieList() {
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<MovieResponseDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const {
    movies,
    pagination,
    isLoading,
    error,
    fetchMovies,
    clearError,
  } = useMoviesStore();

  useEffect(() => {
    fetchMovies({ page: currentPage, limit: 12 });
  }, [currentPage, fetchMovies]);

  const handleEdit = (movie: MovieResponseDto) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingMovie(null);
    fetchMovies({ page: currentPage, limit: 12 });
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMovie(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <MovieForm
          movie={editingMovie || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Movies</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Movie
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No movies found.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Add your first movie
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {movies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onEdit={handleEdit}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              <span className="text-sm text-gray-700">
                Page {currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {((currentPage - 1) * pagination.limit) + 1} to{' '}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
            {pagination.total} movies
          </div>
        </>
      )}
    </div>
  );
} 