"use client";
import React, { useState } from "react";
import MovieCard from "./components/MovieCard";
import { useRouter } from "next/navigation";
import { HeadingOne } from "./components/Typography";

const initialMovies = [
  {
    id: "1",
    title: "Movie 1",
    year: "2021",
    image: "/images/bla.jpeg",
  },
  {
    id: "2",
    title: "Movie 2",
    year: "2022",
    image: "/images/blade.jpeg",
  },
  {
    id: "3",
    title: "Movie 3",
    year: "2023",
    image: "/images/blage.jpeg",
  },
  {
    id: "4",
    title: "Movie 4",
    year: "2024",
    image: "/images/ope.jpeg",
  },
  {
    id: "5",
    title: "Movie 5",
    year: "2024",
    image: "/images/web.jpeg",
  },
];

export default function HomePage() {
  const [movies] = useState(initialMovies);
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between mb-10 mt-6">
        <div className="flex items-center">
          <HeadingOne>My movies</HeadingOne>
          <img src="/images/addButton.svg" className="pl-2 w-8 cursor-pointer" alt="Plus icon" onClick={() => router.push("/add")} />
        </div>
        <div className="btn-logout">
          <span id="logout-text" className="text-2xl leading-none">Logout</span>
          <img src="/images/logout.svg" className="pl-2 w-8" alt="Logout" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-width-container">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => router.push(`/movie/${movie.id}`)}
          />
        ))}
      </div>
    </>
  );
}
