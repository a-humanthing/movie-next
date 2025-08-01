'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const loginMutation = useLogin();
  const { showToast } = useToast();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (apiClient.isAuthenticated() && apiClient.getUser()) {
      router.push('/');
    }
  }, [router]);

  useEffect(()=>{
    if(error){
      showToast(error,'error')
    }
  },[error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await loginMutation.mutateAsync({
        email,
        password,
        rememberMe,
      });
      
      // Redirect to home page after successful login
      router.push('/');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      setError(message);
    }
  };

  return (
    <div className="mt-6 md:mt-4 bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Heading */}
          <h1 className="heading-three text-center text-white mb-8">
            Sign in
          </h1>

          {/* Email Input */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-field w-full"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field w-full"
              required
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" className="ml-2 text-opacity-60 body-regular">
              Remember me
            </label>
          </div>


          {/* Login Button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="btn-primary w-full"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
} 