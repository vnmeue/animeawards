'use client';

import { motion } from 'framer-motion';
import { Category } from '@/types';

type NomineeWithVotes = {
  nominee_id: number;
  vote_count: number;
  nominee: {
    id: number;
    title: string;
    image_url: string;
    type: string;
    description: string;
  };
};

type CategoryWithResults = {
  category: Category;
  nominees: NomineeWithVotes[];
};

interface ResultsClientProps {
  categoriesWithResults: CategoryWithResults[];
}

const ResultsClient = ({ categoriesWithResults }: ResultsClientProps) => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#FFD700]">Voting Results</h1>
        <p className="text-gray-400">
          See how your favorite anime are performing in the awards
        </p>
      </div>

      <div className="space-y-16">
        {categoriesWithResults.map(({ category, nominees }, index) => (
          <motion.section
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-[#242424] rounded-lg p-6 border border-[#333333]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#FFD700]">{category.name}</h2>
              {category.is_new && (
                <span className="bg-[#FFD700] text-[#1a1a1a] text-sm px-3 py-1 rounded-md font-medium">
                  NEW
                </span>
              )}
            </div>

            <div className="space-y-4">
              {nominees.map((nominee, nomineeIndex) => (
                <motion.div
                  key={nominee.nominee_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: nomineeIndex * 0.1 }}
                  className="flex items-center space-x-4 bg-[#1a1a1a] rounded-md p-4 border border-[#333333]"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-[#FFD700] rounded-md text-xl font-bold text-[#1a1a1a]">
                    {nomineeIndex + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#FFD700]">
                      {nominee.nominee.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {nominee.nominee.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#FFD700]">
                      {nominee.vote_count}
                    </div>
                    <div className="text-sm text-gray-400">
                      {nominee.vote_count === 1 ? 'vote' : 'votes'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
};

export default ResultsClient; 