"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { HeadingOne } from "../../../components/Typography";
import { useMovie, useUpdateMovie } from "@/hooks/useMovies";
import { useGetUploadSignature, uploadToCloudinary } from "@/hooks/useFileUpload";

export default function EditMoviePage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;
  
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const { data: movie, isLoading, error } = useMovie(movieId);
  const updateMovieMutation = useUpdateMovie();
  const getUploadSignatureMutation = useGetUploadSignature();

  // Pre-populate form with existing movie data
  useEffect(() => {
    if (movie) {
      setTitle(movie.title);
      setYear(movie.publishingYear.toString());
      setImagePreview(movie.posterUrl);
    }
  }, [movie]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setIsImageChanged(true);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!movie) return;

    try {
      let imageUrl = movie.posterUrl; // Keep existing image if not changed

      // If a new image was selected, upload it to Cloudinary
      if (selectedFile && isImageChanged) {
        // Get upload signature for Cloudinary
        const uploadSignatureResponse = await getUploadSignatureMutation.mutateAsync({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        });

        // Upload file to Cloudinary
        imageUrl = await uploadToCloudinary(selectedFile, uploadSignatureResponse);
      }

      // Update movie with the data
      await updateMovieMutation.mutateAsync({
        id: movieId,
        movie: {
          title,
          publishingYear: parseInt(year),
          posterUrl: imageUrl,
        },
      });

      router.push(`/movie/${movieId}`);
    } catch (error) {
      console.error("Error updating movie:", error);
      alert("Failed to update movie. Please try again.");
    }
  }

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
      <form
        className="flex flex-col md:flex-row gap-10 mt-10"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 flex items-start justify-start">
          <label className="image-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-4" />
            ) : (
              <span className="image-upload-text">Drop an image here</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div className="flex-1 flex flex-col gap-6 w-full md:max-w-[400px] mx-auto">
          <input
            className="input-field"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="input-field w-full md:w-[60%]"
            placeholder="Publishing year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <div className="flex justify-between  gap-6 mt-4">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.push(`/movie/${movieId}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={updateMovieMutation.isPending || getUploadSignatureMutation.isPending}
            >
              {updateMovieMutation.isPending || getUploadSignatureMutation.isPending 
                ? "Updating..." 
                : "Update"
              }
            </button>
          </div>
        </div>
      </form>
    </>
  );
} 