"use client";
import React, { useState, useEffect } from "react";
import MovieCard from "./components/MovieCard";
import Pagination from "./components/Pagination";
import { useRouter } from "next/navigation";
import { HeadingOne } from "./components/Typography";
import { apiClient } from "@/lib/api";
import { MovieResponseDto, PaginatedMoviesResponseDto } from "@/types/api";

export default function HomePage() {
  const [movies, setMovies] = useState<MovieResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    lastPage: 0,
  });
  const router = useRouter();

  const fetchMovies = async (page: number = 1) => {
    try {
      setLoading(true);
      const response: PaginatedMoviesResponseDto = await apiClient.getMovies({
        page,
        limit: 10,
      });
      
      setMovies(response.results);
      setPagination({
        page: response.page,
        total: response.total,
        lastPage: response.lastPage,
      });
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handlePageChange = (page: number) => {
    fetchMovies(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading movies...</div>
      </div>
    );
  }

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
