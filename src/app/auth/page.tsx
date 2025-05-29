'use client';

import { Auth } from '@/components/Auth';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#FFD700] mb-2">
            Subhasha ANIME AWARDS 2025
          </h1>
          <p className="text-gray-300">
            Sign in to vote for your favorite anime
          </p>
        </div>
        <Auth />
      </div>
    </div>
  );
} 