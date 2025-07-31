"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HeadingOne } from "../components/Typography";

export default function AddMoviePage() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Add movie logic here (for demo, just go back)
    router.push("/");
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
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover rounded-4" />
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
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
} 