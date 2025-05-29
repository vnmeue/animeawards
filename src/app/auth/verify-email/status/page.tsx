'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VerifyEmailStatusPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FFD700] mb-4">
            Email Verified!
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mb-8">
            Your email address has been successfully verified.
          </p>
          <Link href="/auth">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FFD700] hover:bg-[#FFE44D] text-[#1a1a1a] px-6 py-3 rounded-full font-bold text-lg shadow-lg transition-colors duration-300"
            >
              Go to Signin
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 