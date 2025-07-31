import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page and surrounding pages
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        end = Math.min(totalPages, 5);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      {/* Prev button */}
      <button
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        className={`text-white font-sans text-base transition-opacity ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'
        }`}
      >
        Prev
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`w-10 h-10 rounded-md font-sans text-base transition-colors ${
            page === currentPage
              ? 'bg-green-400 text-black cursor-default' // Active page - bright green background
              : 'bg-gray-700 text-white hover:bg-gray-600 cursor-pointer' // Inactive page - dark grey background
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        className={`text-white font-sans text-base transition-opacity ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'
        }`}
      >
        Next
      </button>
    </div>
  );
} 