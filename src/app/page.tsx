"use client";
import React, { useState } from "react";
import MovieCard from "./components/MovieCard";
import Pagination from "./components/Pagination";
import { useRouter } from "next/navigation";
import { HeadingOne } from "./components/Typography";
import { useMovies } from "@/hooks/useMovies";
import { useLogout } from "@/hooks/useAuth";

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  
  // Use React Query for fetching movies
  const { data: moviesData, isLoading, error } = useMovies({
    page: currentPage,
    limit: 10,
  });

  const logoutMutation = useLogout();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Error loading movies. Please try again.</div>
      </div>
    );
  }

  const movies = moviesData?.results || [];
  const pagination = {
    page: moviesData?.page || 1,
    total: moviesData?.total || 0,
    lastPage: moviesData?.lastPage || 0,
  };

  return (
    <>
      <div className="flex items-center justify-between mb-10 mt-6">
        <div className="flex items-center">
          <HeadingOne>My movies</HeadingOne>
          <img src="/images/addButton.svg" className="pl-2 w-8 cursor-pointer" alt="Plus icon" onClick={() => router.push("/add")} />
        </div>
        <div className="btn-logout cursor-pointer" onClick={handleLogout}>
          <span id="logout-text" className="text-2xl leading-none">Logout</span>
          <img src="/images/logout.svg" className="pl-2 w-8" alt="Logout" />
        </div>
      </div>
      
      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-white text-xl mb-6">Your movie list is empty</div>
          <button
            onClick={() => router.push("/add")}
            className="flex items-center bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-md transition-colors"
          >
            <img src="/images/addButton.svg" className="w-6 h-6 mr-2" alt="Add icon" />
            Add Movie
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-width-container">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={{
                id: movie._id,
                title: movie.title,
                year: movie.publishingYear.toString(),
                image: movie.posterUrl,
              }}
              onClick={() => router.push(`/movie/${movie._id}`)}
            />
          ))}
        </div>
      )}

      {pagination.lastPage > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.lastPage}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
