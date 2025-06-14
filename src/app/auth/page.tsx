'use client';

import { Auth } from '@/components/Auth';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="min-h-100 flex items-center justify-center py-2 sm:py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-2 sm:space-y-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Subhasha Anime Awards Logo"
                width={120}
                height={12}
              />
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FFD700] mb-2">
            Subhasha ANIME AWARDS
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Sign in to vote for your favorite anime
          </p>
        </motion.div>
        <Suspense fallback={<div>Loading...</div>}>
          <Auth />
        </Suspense>
      </div>
    </div>
  );
} 