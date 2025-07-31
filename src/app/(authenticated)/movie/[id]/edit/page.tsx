"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { HeadingOne } from "@/app/components/Typography";
import { useMovie, useUpdateMovie } from "@/hooks/useMovies";
import MovieForm from "@/app/components/MovieForm";

export default function EditMoviePage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;

  const { data: movie, isLoading, error } = useMovie(movieId);
  const updateMovieMutation = useUpdateMovie();

  const handleSubmit = async (data: {
    title: string;
    publishingYear: number;
    posterUrl: string;
  }) => {
    if (!movie) return;
    
    await updateMovieMutation.mutateAsync({
      id: movieId,
      movie: data,
    });
    
    router.push(`/movie/${movieId}`);
  };

  const handleCancel = () => {
    router.push(`/movie/${movieId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading movie...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-error text-heading-five">Movie not found.</div>
    );
  }

  return (
    <>
      <HeadingOne>Edit movie</HeadingOne>
      <MovieForm
        mode="edit"
        initialData={movie}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateMovieMutation.isPending}
      />
    </>
  );
} 