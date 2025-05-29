'use client';

import Link from 'next/link';
import { Trophy, Film, Tv, Palette, Users, Music, Sparkles } from 'lucide-react';

const CATEGORIES = [
  {
    id: 1,
    name: "Anime of the Year",
    slug: "anime-of-the-year",
    icon: Trophy,
    description: "The best anime series that premiered in 2024",
    isNew: false,
  },
  {
    id: 2,
    name: "Film of the Year",
    slug: "film-of-the-year",
    icon: Film,
    description: "The best anime film released in 2024",
    isNew: false,
  },
  {
    id: 3,
    name: "Best Continuing Series",
    slug: "best-continuing-series",
    icon: Tv,
    description: "The best ongoing anime series",
    isNew: false,
  },
  {
    id: 4,
    name: "Best Background Art",
    slug: "best-background-art",
    icon: Palette,
    description: "The anime with the most stunning background art",
    isNew: true,
  },
  {
    id: 5,
    name: "Best Isekai Anime",
    slug: "best-isekai-anime",
    icon: Sparkles,
    description: "The best anime in the isekai genre",
    isNew: true,
  },
  {
    id: 6,
    name: "Best Main Character",
    slug: "best-main-character",
    icon: Users,
    description: "The most compelling main character",
    isNew: false,
  },
  {
    id: 7,
    name: "Best Anime Song",
    slug: "best-anime-song",
    icon: Music,
    description: "The best song from an anime",
    isNew: false,
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FFD700] mb-4">
            Award Categories
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore all the categories and vote for your favorites. Each category represents a unique aspect of anime excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#FFD700]/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white group-hover:text-[#FFD700] transition-colors">
                        {category.name}
                      </h2>
                      {category.isNew && (
                        <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full font-bold">
                          NEW!
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 mt-2 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};