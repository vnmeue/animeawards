'use client';

import { motion } from 'framer-motion';
import { Trophy, Users, Award } from 'lucide-react';
import { Category } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';

interface Nominee {
  id: number;
  title: string;
  image: string;
}

interface VoteCount {
  category_id: number;
  nominee_id: number;
  vote_count: number;
  nominees: Nominee;
}

interface ResultsContentProps {
  categories: (Category & { icon: LucideIcon })[];
  voteCounts: VoteCount[];
  totalVotes: number;
}

export function ResultsContent({ categories, voteCounts, totalVotes }: ResultsContentProps) {
  // Create a map of vote counts for each category
  const categoryVoteMap = new Map<number, VoteCount[]>();
  voteCounts.forEach(vc => {
    const existing = categoryVoteMap.get(vc.category_id) || [];
    categoryVoteMap.set(vc.category_id, [...existing, vc]);
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-[#FFD700]" />
          <h1 className="text-4xl font-bold text-[#FFD700]">Voting Results</h1>
        </div>
        <p className="text-gray-400">Live results from all categories</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-[#242424] rounded-xl p-6 border border-[#333333]">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-[#FFD700]" />
            <h3 className="text-lg font-semibold text-[#FFD700]">Categories</h3>
          </div>
          <p className="text-3xl font-bold text-white">{categories.length}</p>
        </div>
        <div className="bg-[#242424] rounded-xl p-6 border border-[#333333]">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-[#FFD700]" />
            <h3 className="text-lg font-semibold text-[#FFD700]">Total Votes</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalVotes.toLocaleString()}</p>
        </div>
        <div className="bg-[#242424] rounded-xl p-6 border border-[#333333]">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-[#FFD700]" />
            <h3 className="text-lg font-semibold text-[#FFD700]">Active Categories</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {Array.from(categoryVoteMap.keys()).length}
          </p>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="space-y-8">
        {categories.map((category, categoryIndex) => {
          const categoryVotes = categoryVoteMap.get(category.id) || [];
          const totalCategoryVotes = categoryVotes.reduce((sum, vc) => sum + vc.vote_count, 0);
          
          // Sort nominees by vote count
          const sortedVotes = [...categoryVotes].sort((a, b) => b.vote_count - a.vote_count);

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-[#242424] rounded-xl p-6 border border-[#333333]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <category.icon className="w-6 h-6 text-[#FFD700]" />
                  <h2 className="text-2xl font-bold text-[#FFD700]">{category.name}</h2>
                </div>
                <Link 
                  href={`/categories/${category.slug}`}
                  className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors"
                >
                  View Details →
                </Link>
              </div>

              <div className="space-y-4">
                {sortedVotes.map((vote, index) => {
                  const percentage = totalCategoryVotes > 0 
                    ? (vote.vote_count / totalCategoryVotes) * 100 
                    : 0;

                  return (
                    <motion.div
                      key={vote.nominee_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-[#1a1a1a] rounded-lg p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={vote.nominees.image}
                            alt={vote.nominees.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-[#FFD700] font-bold">#{index + 1}</span>
                              <h3 className="text-lg font-semibold text-white">
                                {vote.nominees.title}
                              </h3>
                            </div>
                            <div className="text-[#FFD700] font-bold">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                          <div className="w-full bg-[#333333] rounded-full h-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="bg-[#FFD700] h-3 rounded-full"
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-400 mt-2">
                            <span>{vote.vote_count} votes</span>
                            <span>{totalCategoryVotes} total votes</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 