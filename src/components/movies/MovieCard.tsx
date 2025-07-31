'use client';

import { useState } from 'react';
import { MovieResponseDto } from '@/types/api';
import { Edit, Trash2 } from 'lucide-react';

interface MovieCardProps {
  movie: MovieResponseDto;
  onEdit: (movie: MovieResponseDto) => void;
  onDelete?: (id: string) => void;
}

export default function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (confirm('Are you sure you want to delete this movie?')) {
      setIsDeleting(true);
      try {
        await onDelete(movie._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x400?text=No+Poster';
          }}
        />
        
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={() => onEdit(movie)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            title="Edit movie"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
              title="Delete movie"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-gray-600 mb-3">
          {movie.publishingYear}
        </p>
        
        <div className="text-xs text-gray-500">
          <p>Created: {new Date(movie.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(movie.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
} 