'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import HomePage from './components/HomePage';

export default function RootPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = apiClient.getUser();
      const isAuthenticated = apiClient.isAuthenticated();
            
      if (isAuthenticated && currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If user is authenticated, show the home page content
  if (user) {
    return <HomePage />;
  }

  // If not authenticated, show loading while redirecting
  return <LoadingSpinner />;
} 