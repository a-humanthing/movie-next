"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { HeadingOne } from "../components/Typography";
import { useCreateMovie } from "@/hooks/useMovies";
import MovieForm from "../components/MovieForm";

export default function AddMoviePage() {
  const router = useRouter();
  const createMovieMutation = useCreateMovie();

  const handleSubmit = async (data: {
    title: string;
    publishingYear: number;
    posterUrl: string;
  }) => {
    await createMovieMutation.mutateAsync(data);
    router.push("/");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <>
      <HeadingOne>Create a new movie</HeadingOne>
      <MovieForm
        mode="add"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createMovieMutation.isPending}
      />
    </>
  );
} 