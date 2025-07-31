import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AuthResponseDto,
  LoginDto,
  UserProfileDto,
  RefreshTokenResponseDto,
  LogoutResponseDto,
  PaginatedMoviesResponseDto,
  CreateMovieDto,
  UpdateMovieDto,
  MovieResponseDto,
  SignedUrlResponseDto,
  GetSignedUrlDto,
  DeleteFileResponseDto,
  HealthCheckResponseDto,
  ApiInfoResponseDto,
  PaginationParams,
  ApiError,
  UploadSignatureResponse,
  GetUploadSignatureDto,
} from '@/types/api';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.clearAuth();
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token);
    }
  }

  private clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const response = await axios.post<RefreshTokenResponseDto>(
        `${this.baseURL}/auth/refresh`,
        {},
        {
          withCredentials: true, // Include cookies for refresh token
        }
      );
      
      const { accessToken } = response.data;
      this.setAccessToken(accessToken);
      return accessToken;
    } catch (error) {
      return null;
    }
  }

  // System endpoints
  async getHealthCheck(): Promise<HealthCheckResponseDto> {
    const response = await this.client.get<HealthCheckResponseDto>('/');
    return response.data;
  }

  async getApiInfo(): Promise<ApiInfoResponseDto> {
    const response = await this.client.get<ApiInfoResponseDto>('/info');
    return response.data;
  }

  // Authentication endpoints
  async login(credentials: LoginDto): Promise<AuthResponseDto> {
    const response = await this.client.post<AuthResponseDto>('/auth/login', credentials);
    const { accessToken, refreshToken, user } = response.data;
    
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  }

  async logout(): Promise<LogoutResponseDto> {
    const response = await this.client.post<LogoutResponseDto>('/auth/logout');
    this.clearAuth();
    return response.data;
  }

  async getProfile(): Promise<UserProfileDto> {
    const response = await this.client.get<UserProfileDto>('/auth/profile');
    return response.data;
  }

  // Movie endpoints
  async getMovies(params?: PaginationParams): Promise<PaginatedMoviesResponseDto> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await this.client.get<PaginatedMoviesResponseDto>(
      `/movies?${queryParams.toString()}`
    );
    return response.data;
  }

  async createMovie(movie: CreateMovieDto): Promise<MovieResponseDto> {
    const response = await this.client.post<MovieResponseDto>('/movies', movie);
    return response.data;
  }

  async updateMovie(id: string, movie: UpdateMovieDto): Promise<MovieResponseDto> {
    const response = await this.client.patch<MovieResponseDto>(`/movies/${id}`, movie);
    return response.data;
  }

  async getMovie(id: string): Promise<MovieResponseDto> {
    const response = await this.client.get<MovieResponseDto>(`/movies/${id}`);
    return response.data;
  }

  async deleteMovie(id: string): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(`/movies/${id}`);
    return response.data;
  }

  // File management endpoints (S3 - deprecated)
  async getSignedUrl(fileInfo: GetSignedUrlDto): Promise<SignedUrlResponseDto> {
    const response = await this.client.post<SignedUrlResponseDto>('/s3/upload-url', fileInfo);
    return response.data;
  }

  async deleteFile(key: string): Promise<DeleteFileResponseDto> {
    const response = await this.client.delete<DeleteFileResponseDto>(`/s3/files/${key}`);
    return response.data;
  }

  // Cloudinary upload endpoints
  async getUploadSignature(fileInfo: GetUploadSignatureDto): Promise<UploadSignatureResponse> {
    const response = await this.client.post<UploadSignatureResponse>('/s3/upload-url', fileInfo);
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getUser(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}

// Create singleton instance
export const apiClient = new ApiClient(); 