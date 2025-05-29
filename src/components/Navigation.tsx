'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface ExtendedUser extends User {
  username: string;
}

export function Navigation() {
  const router = useRouter();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.warn('Supabase environment variables are not configured');
          setLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching profile:', error);
            setUser({ 
              ...user, 
              username: user.user_metadata?.username || 'User' 
            } as ExtendedUser);
          } else {
            setUser({ 
              ...user, 
              username: profile?.username || user.user_metadata?.username || 'User' 
            } as ExtendedUser);
          }
        }
      } catch (error) {
        console.error('Error in getUser:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await getUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl shadow-lg z-[100] sm:fixed sm:top-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:w-[calc(100%-2rem)] sm:max-w-7xl sm:bg-[#2a2a2a] sm:border sm:border-[#3a3a3a] sm:rounded-xl sm:shadow-lg sm:hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-10 sm:h-12 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-[#FFD700] font-bold hover:text-[#FFE44D] text-sm sm:text-base">
              Subhasha ANIME AWARDS
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {loading ? (
              <div className="text-gray-300 text-xs sm:text-base">Loading...</div>
            ) : user ? (
              <>
                <span className="text-gray-300 whitespace-nowrap text-xs sm:text-base hidden sm:inline">
                  Welcome, {user.username}
                </span>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className={`bg-[#333333] hover:bg-[#444444] text-white px-2.5 sm:px-4 py-1 rounded-md whitespace-nowrap text-xs sm:text-sm ${
                    signingOut ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {signingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="bg-[#FFD700] hover:bg-[#FFE44D] text-[#1a1a1a] px-2.5 sm:px-4 py-1 rounded-md whitespace-nowrap text-xs sm:text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 