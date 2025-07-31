'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import LoginForm from './LoginForm';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, checkAuth, getProfile } = useAuthStore();

  useEffect(() => {
    checkAuth();
    
    // If authenticated, get fresh profile data
    if (isAuthenticated) {
      getProfile();
    }
  }, [checkAuth, getProfile, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your movie collection
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 