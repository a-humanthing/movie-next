"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useMovie, useDeleteMovie } from "@/hooks/useMovies";

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;
  
  const { data: movie, isLoading, error } = useMovie(movieId);
  const deleteMovieMutation = useDeleteMovie();

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
    <div className="flex flex-col md:flex-row gap-16">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full md:w-96 h-96 object-cover rounded-lg bg-card-bg"
      />
      <div className="flex flex-col gap-8">
        <h1 className="font-semibold text-heading-three">{movie.title}</h1>
        <div className="text-body-large text-white/70">{movie.publishingYear}</div>
        <div className="flex gap-4 mt-8">
          <button
            className="bg-primary text-white px-8 py-3 rounded font-bold w-max"
            onClick={() => router.push("/")}
          >
            Back to list
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded font-bold w-max transition-colors"
            onClick={() => {
              if (confirm("Are you sure you want to delete this movie?")) {
                deleteMovieMutation.mutate(movieId, {
                  onSuccess: () => {
                    router.push("/");
                  },
                });
              }
            }}
            disabled={deleteMovieMutation.isPending}
          >
            {deleteMovieMutation.isPending ? "Deleting..." : "Delete Movie"}
          </button>
        </div>
      </div>
    </div>
  );
}

