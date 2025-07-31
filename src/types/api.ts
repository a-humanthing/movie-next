// API Response Types
export interface HealthCheckResponseDto {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export interface ApiInfoResponseDto {
  name: string;
  version: string;
  description: string;
  endpoints: {
    auth: string;
    movies: string;
    s3: string;
    swagger: string;
  };
}

// Authentication Types
export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RefreshTokenResponseDto {
  accessToken: string;
}

export interface LogoutResponseDto {
  message: string;
}

export interface UserProfileDto {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

// Movie Types
export interface MovieResponseDto {
  _id: string;
  title: string;
  publishingYear: number;
  posterUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMoviesResponseDto {
  results: MovieResponseDto[];
  total: number;
  page: number;
  lastPage: number;
}

export interface CreateMovieDto {
  title: string;
  publishingYear: number;
  posterUrl: string;
}

export interface UpdateMovieDto {
  title?: string;
  publishingYear?: number;
  posterUrl?: string;
}

// File Management Types
export interface GetSignedUrlDto {
  fileName: string;
  fileType: string;
}

export interface SignedUrlResponseDto {
  url: string;
}

export interface DeleteFileResponseDto {
  message: string;
}

// API Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
} 