"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetUploadSignature, uploadToCloudinary } from "@/hooks/useFileUpload";

interface MovieFormProps {
  mode: "add" | "edit";
  initialData?: {
    id?: string;
    title?: string;
    publishingYear?: number;
    posterUrl?: string;
  };
  onSubmit: (data: {
    title: string;
    publishingYear: number;
    posterUrl: string;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  loadingText?: string;
  submitText?: string;
}

export default function MovieForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  loadingText,
  submitText,
}: MovieFormProps) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const getUploadSignatureMutation = useGetUploadSignature();

  // Pre-populate form with existing movie data for edit mode
  useEffect(() => {
    if (initialData && mode === "edit") {
      setTitle(initialData.title || "");
      setYear(initialData.publishingYear?.toString() || "");
      setImagePreview(initialData.posterUrl || null);
    }
  }, [initialData, mode]);

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
    
    if (mode === "add" && !selectedFile) {
      alert("Please select an image");
      return;
    }

    try {
      let imageUrl = initialData?.posterUrl || ""; // Keep existing image if not changed

      // If a new image was selected, upload it to Cloudinary
      if (selectedFile && (mode === "add" || isImageChanged)) {
        // Get upload signature for Cloudinary
        const uploadSignatureResponse = await getUploadSignatureMutation.mutateAsync({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        });

        // Upload file to Cloudinary
        imageUrl = await uploadToCloudinary(selectedFile, uploadSignatureResponse);
      }

      // Submit the form data
      await onSubmit({
        title,
        publishingYear: parseInt(year),
        posterUrl: imageUrl,
      });
    } catch (error) {
      console.error(`Error ${mode === "add" ? "creating" : "updating"} movie:`, error);
      alert(`Failed to ${mode === "add" ? "create" : "update"} movie. Please try again.`);
    }
  }

  const isFormLoading = isLoading || getUploadSignatureMutation.isPending;
  const defaultLoadingText = mode === "add" ? "Creating..." : "Updating...";
  const defaultSubmitText = mode === "add" ? "Submit" : "Update";

  return (
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
        <div className="flex justify-between gap-6 mt-4">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isFormLoading}
          >
            {isFormLoading ? (loadingText || defaultLoadingText) : (submitText || defaultSubmitText)}
          </button>
        </div>
      </div>
    </form>
  );
} 