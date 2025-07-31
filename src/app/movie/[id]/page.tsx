"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

const demoMovies = [
  {
    id: "1",
    title: "Movie 1",
    year: "2021",
    image: "/file.svg",
  },
  {
    id: "2",
    title: "Movie 2",
    year: "2022",
    image: "/globe.svg",
  },
  {
    id: "3",
    title: "Movie 3",
    year: "2023",
    image: "/next.svg",
  },
  {
    id: "4",
    title: "Movie 4",
    year: "2024",
    image: "/window.svg",
  },
];

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const movie = demoMovies.find((m) => m.id === params.id);

  if (!movie) {
    return (
      <div className="text-error text-heading-five">Movie not found.</div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-16">
      <img
        src={movie.image}
        alt={movie.title}
        className="w-full md:w-96 h-96 object-cover rounded-lg bg-card-bg"
      />
      <div className="flex flex-col gap-8">
        <h1 className="font-semibold text-heading-three">{movie.title}</h1>
        <div className="text-body-large text-white/70">{movie.year}</div>
        <button
          className="mt-8 bg-primary text-white px-8 py-3 rounded font-bold w-max"
          onClick={() => router.push("/")}
        >
          Back to list
        </button>
      </div>
    </div>
  );
}

