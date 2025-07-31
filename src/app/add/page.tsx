"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HeadingOne } from "../components/Typography";
import { useCreateMovie } from "@/hooks/useMovies";
import { useGetUploadSignature, uploadToCloudinary } from "@/hooks/useFileUpload";

export default function AddMoviePage() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const createMovieMutation = useCreateMovie();
  const getUploadSignatureMutation = useGetUploadSignature();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Please select an image");
      return;
    }

    try {
      // Get upload signature for Cloudinary
      const uploadSignatureResponse = await getUploadSignatureMutation.mutateAsync({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      });

      // Upload file to Cloudinary
      const imageUrl = await uploadToCloudinary(selectedFile, uploadSignatureResponse);

      // Create movie with the uploaded image URL
      await createMovieMutation.mutateAsync({
        title,
        publishingYear: parseInt(year),
        posterUrl: imageUrl,
      });

      router.push("/");
    } catch (error) {
      console.error("Error creating movie:", error);
      alert("Failed to create movie. Please try again.");
    }
  }

  return (
    <>
      <HeadingOne>Create a new movie</HeadingOne>
      <form
        className="flex flex-col md:flex-row gap-10 mt-10"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 flex items-center justify-center">
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
        <div className="flex-1 flex flex-col gap-6 max-w-[400px] mx-auto">
          <input
            className="input-field"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="input-field"
            placeholder="Publishing year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <div className="flex gap-6 mt-4">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={createMovieMutation.isPending || getUploadSignatureMutation.isPending}
            >
              {createMovieMutation.isPending || getUploadSignatureMutation.isPending 
                ? "Creating..." 
                : "Submit"
              }
            </button>
          </div>
        </div>
      </form>
    </>
  );
} 