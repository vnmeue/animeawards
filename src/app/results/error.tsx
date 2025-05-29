'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h2 className="text-2xl font-bold text-[#FFD700]">Something went wrong!</h2>
      <p className="text-gray-400">Failed to load voting results</p>
      <button
        onClick={reset}
        className="bg-[#FFD700] hover:bg-[#FFE44D] text-[#1a1a1a] px-4 py-2 rounded-md font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
} 