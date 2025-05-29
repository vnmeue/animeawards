'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Handle error from URL hash
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      if (error === 'access_denied' && errorDescription?.includes('expired')) {
        setError('Your confirmation link has expired. Please request a new one.');
        // Clear the hash from the URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    }

    // Handle success message from query params
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleResendConfirmation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      setSuccessMessage('A new confirmation email has been sent. Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend confirmation email');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });

        if (signUpError) throw signUpError;

        // Create user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              username,
            });

          if (profileError) throw profileError;
        }

        setSuccessMessage('Please check your email to confirm your account.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          if (signInError.message === 'Email not confirmed') {
            setError('Please confirm your email before signing in.');
          } else {
            throw signInError;
          }
        } else {
          // Successful sign in - redirect to home
          router.push('/');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-[#242424] rounded-lg p-8 border border-[#333333]"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-[#FFD700]">
        {isSignUp ? 'Create Account' : 'Sign In'}
      </h2>

      <form onSubmit={handleAuth} className="space-y-4">
        {isSignUp && (
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1a1a1a] border border-[#333333] focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-white"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#1a1a1a] border border-[#333333] focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#1a1a1a] border border-[#333333] focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] text-white"
            required
          />
        </div>

        {error && (
          <div className="space-y-2">
            <p className="text-red-400 text-sm">{error}</p>
            {error.includes('expired') && (
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={loading}
                className="text-[#FFD700] hover:text-[#FFE44D] text-sm underline"
              >
                Resend confirmation email
              </button>
            )}
          </div>
        )}

        {successMessage && (
          <p className="text-green-400 text-sm">{successMessage}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-2 px-4 rounded-md font-medium transition-colors
            ${loading
              ? 'bg-[#333333] text-gray-400 cursor-wait'
              : 'bg-[#FFD700] hover:bg-[#FFE44D] text-[#1a1a1a]'
            }
          `}
        >
          {loading
            ? 'Please wait...'
            : isSignUp
            ? 'Sign Up'
            : 'Sign In'
          }
        </button>

        <p className="text-center text-sm text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#FFD700] hover:text-[#FFE44D]"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </form>
    </motion.div>
  );
} 