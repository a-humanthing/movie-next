'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMoviesStore } from '@/store/movies';
import { CreateMovieDto, UpdateMovieDto, MovieResponseDto } from '@/types/api';
import { apiClient } from '@/lib/api';

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  publishingYear: z.number()
    .min(1888, 'Year must be at least 1888')
    .max(2030, 'Year must be at most 2030'),
  posterUrl: z.string().url('Please enter a valid URL'),
});

type MovieFormData = z.infer<typeof movieSchema>;

interface MovieFormProps {
  movie?: MovieResponseDto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function MovieForm({ movie, onSuccess, onCancel }: MovieFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { createMovie, updateMovie, error, clearError } = useMoviesStore();
  const isEditing = !!movie;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: movie ? {
      title: movie.title,
      publishingYear: movie.publishingYear,
      posterUrl: movie.posterUrl,
    } : undefined,
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    clearError();

    try {
      // Get signed URL
      const signedUrlResponse = await apiClient.getSignedUrl({
        fileName: file.name,
        fileType: file.type,
      });

      // Upload file to S3
      const uploadResponse = await fetch(signedUrlResponse.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Extract the file URL from the signed URL (remove query parameters)
      const fileUrl = signedUrlResponse.url.split('?')[0];
      setValue('posterUrl', fileUrl);
    } catch (error: any) {
      console.error('Upload error:', error);
      // Handle upload error
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: MovieFormData) => {
    setIsSubmitting(true);
    clearError();

    try {
      if (isEditing) {
        const updateData: UpdateMovieDto = {
          title: data.title,
          publishingYear: data.publishingYear,
          posterUrl: data.posterUrl,
        };
        await updateMovie(movie._id, updateData);
      } else {
        const createData: CreateMovieDto = {
          title: data.title,
          publishingYear: data.publishingYear,
          posterUrl: data.posterUrl,
        };
        await createMovie(createData);
      }
      
      onSuccess?.();
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Movie' : 'Add New Movie'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter movie title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="publishingYear" className="block text-sm font-medium text-gray-700">
            Publishing Year
          </label>
          <input
            {...register('publishingYear', { valueAsNumber: true })}
            type="number"
            id="publishingYear"
            min="1888"
            max="2030"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter publishing year"
          />
          {errors.publishingYear && (
            <p className="mt-1 text-sm text-red-600">{errors.publishingYear.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-700">
            Poster URL
          </label>
          <input
            {...register('posterUrl')}
            type="url"
            id="posterUrl"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter poster URL"
          />
          {errors.posterUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.posterUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
            Upload Poster
          </label>
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          />
          {isUploading && (
            <p className="mt-1 text-sm text-blue-600">Uploading...</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Movie' : 'Add Movie')}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 