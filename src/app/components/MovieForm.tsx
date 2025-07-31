"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetUploadSignature, uploadToCloudinary } from "@/hooks/useFileUpload";
import { useToast } from "@/components/Toast";

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
  const [validationError, setValidationError] = useState<string | null>(null);

  const getUploadSignatureMutation = useGetUploadSignature();
  const { showToast } = useToast();

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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB', 'error');
        return;
      }

      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setIsImageChanged(true);
      setValidationError(null);
    }
  }

  function validateForm(): boolean {
    if (!title.trim()) {
      setValidationError('Title is required');
      showToast('Title is required', 'error');
      return false;
    }

    if (!year.trim()) {
      setValidationError('Publishing year is required');
      showToast('Publishing year is required', 'error');
      return false;
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1888 || yearNum > new Date().getFullYear() + 1) {
      setValidationError('Please enter a valid year between 1888 and next year');
      showToast('Please enter a valid year between 1888 and next year', 'error');
      return false;
    }

    if (mode === "add" && !selectedFile) {
      setValidationError('Please select an image');
      showToast('Please select an image', 'error');
      return false;
    }

    setValidationError(null);
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
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
        title: title.trim(),
        publishingYear: parseInt(year),
        posterUrl: imageUrl,
      });

      showToast(`Movie ${mode === "add" ? "created" : "updated"} successfully!`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${mode === "add" ? "create" : "update"} movie`;
      showToast(errorMessage, 'error');
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
        <div>
          <input
            className={`input-field ${validationError && !title.trim() ? 'border-red-500' : ''}`}
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError(null);
            }}
            required
          />
          {validationError && !title.trim() && (
            <p className="text-red-500 text-sm mt-1">{validationError}</p>
          )}
        </div>
        <div>
          <input
            className={`input-field w-full md:w-[60%] ${validationError && !year.trim() ? 'border-red-500' : ''}`}
            placeholder="Publishing year"
            type="number"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              if (validationError) setValidationError(null);
            }}
            required
          />
          {validationError && !year.trim() && (
            <p className="text-red-500 text-sm mt-1">{validationError}</p>
          )}
        </div>
        <div className="flex justify-between gap-6 mt-4">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isFormLoading}
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