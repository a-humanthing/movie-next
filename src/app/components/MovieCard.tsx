import Image from "next/image";
import React from "react";

type Movie = {
  id: string;
  title: string;
  year: string;
  image: string;
};

export default function MovieCard({ movie, onClick }: { movie: Movie; onClick?: () => void }) {
  return (
    <div className="movie-card" onClick={onClick}>
      <div className="movie-card-image">
        <Image
          src={movie.image}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="movie-card-content">
        <h3 className="movie-card-title">
          {movie.title}
        </h3>
        <p className="movie-card-year">
          {movie.year}
        </p>
      </div>
    </div>
  );
} 