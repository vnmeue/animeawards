'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Nominee } from '@/types';
import { Heart, Vote } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface VoteCardProps {
  nominee: Nominee;
  categoryId: number;
  voteCount: number;
}

export function VoteCard({ nominee, categoryId, voteCount }: VoteCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const router = useRouter();

  const handleVote = async () => {
    if (hasVoted) return;
    
    setIsVoting(true);
    setShowSubmit(true);
    setIsVoting(false);
  };

  const handleSubmit = async () => {
    try {
      setIsVoting(true);
      const { error } = await supabase
        .from('votes')
        .insert([
          {
            category_id: categoryId,
            nominee_id: nominee.id,
          },
        ]);

      if (error) throw error;

      setHasVoted(true);
      setShowSubmit(false);
      router.refresh();
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleCancel = () => {
    setShowSubmit(false);
  };

  return (
    <div className="relative group">
      <div className={`relative overflow-hidden rounded-xl bg-[#1a1a1a] border border-[#333333] transition-all duration-300 ${
        hasVoted ? 'ring-2 ring-[#FFD700]' : 'hover:border-[#FFD700]'
      }`}>
        <div className="aspect-[3/4] overflow-hidden">
          <Image
            src={nominee.image}
            alt={nominee.title}
            width={300}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="text-white font-semibold text-lg mb-2">
            {nominee.title}
          </h4>

          <div className="flex items-center justify-between text-sm text-[#FFD700]">
            <span>{voteCount} votes</span>
            {hasVoted && (
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 fill-current" />
                Voted
              </span>
            )}
          </div>
        </div>

        {!hasVoted && !showSubmit && (
          <div 
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
            onClick={handleVote}
          >
            <Vote className="w-8 h-8 text-[#FFD700]" />
          </div>
        )}

        {showSubmit && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-4 p-4">
            <button
              onClick={handleSubmit}
              disabled={isVoting}
              className="bg-[#FFD700] hover:bg-[#FFE44D] text-[#1a1a1a] px-4 py-2 rounded-md font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVoting ? 'Submitting...' : 'Submit Vote'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isVoting}
              className="bg-[#333333] hover:bg-[#444444] text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 