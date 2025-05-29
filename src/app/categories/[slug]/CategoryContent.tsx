'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Category, Nominee } from '@/types';

interface VoteCount {
  nominee_id: number;
  vote_count: number;
}

interface CategoryContentProps {
  category: Category;
  nominees: Nominee[];
  voteCounts: VoteCount[];
}

export function CategoryContent({ category, nominees, voteCounts }: CategoryContentProps) {
  const voteCountMap = new Map(
    voteCounts.map((vc) => [vc.nominee_id, vc.vote_count])
  );

  const totalVotes = voteCounts.reduce((sum, vc) => sum + vc.vote_count, 0);

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-[#FFD700]" />
          <h1 className="text-4xl font-bold text-[#FFD700]">{category.name}</h1>
        </div>
        <p className="text-gray-400">{category.description}</p>
      </motion.div>

      {nominees.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {nominees.map((nominee, index) => {
            const voteCount = voteCountMap.get(nominee.id) || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

            return (
              <motion.div
                key={nominee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#242424] rounded-xl p-6 border border-[#333333]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{nominee.title}</h3>
                  <div className="text-[#FFD700] font-bold">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
                <div className="w-full bg-[#333333] rounded-full h-4 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-[#FFD700] h-4 rounded-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{voteCount} votes</span>
                  <span>{totalVotes} total votes</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No nominees found for this category.</p>
        </div>
      )}
    </div>
  );
} 