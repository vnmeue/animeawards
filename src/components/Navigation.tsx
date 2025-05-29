'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  username: string;
}

interface ExtendedUser extends User {
  username: string;
}

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
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
          // Fetch user profile with proper error handling
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching profile:', error);
            // If profile fetch fails, still set the user with basic info
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
    <nav className="bg-[#242424] border-b border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-[#FFD700] font-bold hover:text-[#FFE44D]">
              Subhasha ANIME AWARDS 2025
            </Link>
            <Link 
              href="/categories" 
              className={`text-gray-300 hover:text-[#FFD700] ${
                pathname === '/categories' ? 'text-[#FFD700]' : ''
              }`}
            >
              Categories
            </Link>
            <Link 
              href="/results" 
              className={`text-gray-300 hover:text-[#FFD700] ${
                pathname === '/results' ? 'text-[#FFD700]' : ''
              }`}
            >
              Results
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="text-gray-300">Loading...</div>
            ) : user ? (
              <>
                <span className="text-gray-300">Welcome, {user.username}</span>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className={`bg-[#333333] hover:bg-[#444444] text-white px-4 py-2 rounded-md ${
                    signingOut ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {signingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="bg-[#FFD700] hover:bg-[#FFE44D] text-[#1a1a1a] px-4 py-2 rounded-md"
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