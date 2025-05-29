"use client"
import React, { useState, useEffect } from 'react';
import { Heart, Trophy, Film, Tv, Palette, Users, Music, Vote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { IMAGE_URLS, COLORS } from '@/lib/constants';
import Link from 'next/link';

interface Nominee {
  id: number;
  title: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  isNew: boolean;
  nominees: Nominee[];
}

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
}

interface VoteCounts {
  [key: string]: number;
}

interface Votes {
  [key: number]: number;
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Anime of the Year",
    slug: "anime-of-the-year",
    icon: Trophy,
    isNew: false,
    nominees: [
      { id: 1, title: "DAN DA DAN", image: IMAGE_URLS.DAN_DA_DAN },
      { id: 2, title: "Delicious in Dungeon", image: IMAGE_URLS.DELICIOUS_IN_DUNGEON },
      { id: 3, title: "Frieren: Beyond Journey's End", image: IMAGE_URLS.FRIEREN },
      { id: 4, title: "Kaiju No. 8", image: IMAGE_URLS.KAIJU_NO_8 },
      { id: 5, title: "Solo Leveling", image: IMAGE_URLS.SOLO_LEVELING },
      { id: 6, title: "The Apothecary Diaries", image: IMAGE_URLS.APOTHECARY_DIARIES }
    ]
  },
  {
    id: 2,
    name: "Film of the Year",
    slug: "film-of-the-year",
    icon: Film,
    isNew: false,
    nominees: [
      { id: 7, title: "HAIKYU!! The Dumpster Battle", image: IMAGE_URLS.HAIKYU },
      { id: 8, title: "Look Back", image: IMAGE_URLS.LOOK_BACK },
      { id: 9, title: "Mononoke The Movie: The Phantom in the Rain", image: IMAGE_URLS.MONONOKE },
      { id: 10, title: "My Hero Academia: You're Next", image: IMAGE_URLS.MHA_MOVIE },
      { id: 11, title: "SPY x FAMILY CODE: White", image: IMAGE_URLS.SPY_FAMILY_MOVIE },
      { id: 12, title: "The Colors Within", image: IMAGE_URLS.COLORS_WITHIN }
    ]
  },
  {
    id: 3,
    name: "Best Continuing Series",
    slug: "best-continuing-series",
    icon: Tv,
    isNew: false,
    nominees: [
      { id: 13, title: "BLEACH: Thousand-Year Blood War", image: IMAGE_URLS.BLEACH },
      { id: 14, title: "Demon Slayer: Hashira Training Arc", image: IMAGE_URLS.DEMON_SLAYER },
      { id: 15, title: "My Hero Academia Season 7", image: IMAGE_URLS.MHA_SEASON7 },
      { id: 16, title: "ONE PIECE", image: IMAGE_URLS.ONE_PIECE },
      { id: 17, title: "OSHI NO KO Season 2", image: IMAGE_URLS.OSHI_NO_KO },
      { id: 18, title: "SPY x FAMILY Season 2", image: IMAGE_URLS.SPY_FAMILY_SEASON2 }
    ]
  },
  {
    id: 4,
    name: "Best Background Art",
    slug: "best-background-art",
    icon: Palette,
    isNew: true,
    nominees: [
      { id: 19, title: "DAN DA DAN", image: IMAGE_URLS.DAN_DA_DAN },
      { id: 20, title: "Delicious in Dungeon", image: IMAGE_URLS.DELICIOUS_IN_DUNGEON },
      { id: 21, title: "Demon Slayer: Hashira Training Arc", image: IMAGE_URLS.DEMON_SLAYER },
      { id: 22, title: "Frieren: Beyond Journey's End", image: IMAGE_URLS.FRIEREN },
      { id: 23, title: "Pluto", image: IMAGE_URLS.PLUTO },
      { id: 24, title: "The Apothecary Diaries", image: IMAGE_URLS.APOTHECARY_DIARIES }
    ]
  },
  {
    id: 5,
    name: "Best Isekai Anime",
    slug: "best-isekai-anime",
    icon: Sparkles,
    isNew: true,
    nominees: [
      { id: 25, title: "KONOSUBA Season 3", image: IMAGE_URLS.KONOSUBA },
      { id: 26, title: "Mushoku Tensei Season 2", image: IMAGE_URLS.MUSHOKU_TENSEI },
      { id: 27, title: "Re:ZERO Season 3", image: IMAGE_URLS.REZERO },
      { id: 28, title: "Shangri-La Frontier Season 2", image: IMAGE_URLS.SHANGRI_LA },
      { id: 29, title: "Suicide Squad ISEKAI", image: IMAGE_URLS.SUICIDE_SQUAD },
      { id: 30, title: "That Time I Got Reincarnated as a Slime Season 3", image: IMAGE_URLS.SLIME }
    ]
  },
  {
    id: 6,
    name: "Best Main Character",
    slug: "best-main-character",
    icon: Users,
    isNew: false,
    nominees: [
      { id: 31, title: "Frieren", image: IMAGE_URLS.FRIEREN },
      { id: 32, title: "Kafka Hibino", image: IMAGE_URLS.KAFKA },
      { id: 33, title: "Okarun", image: IMAGE_URLS.OKARUN },
      { id: 34, title: "Maomao", image: IMAGE_URLS.MAOMAO },
      { id: 35, title: "Momo", image: IMAGE_URLS.MOMO },
      { id: 36, title: "Sung Jinwoo", image: IMAGE_URLS.SUNG_JINWOO }
    ]
  },
  {
    id: 7,
    name: "Best Anime Song",
    slug: "best-anime-song",
    icon: Music,
    isNew: false,
    nominees: [
      { id: 37, title: "Abyss by Yungblud", image: IMAGE_URLS.ABYSS },
      { id: 38, title: "Bling-Bang-Bang-Born by Creepy Nuts", image: IMAGE_URLS.BLING_BANG },
      { id: 39, title: "Fatal by GEMN", image: IMAGE_URLS.FATAL },
      { id: 40, title: "LEveL by TOMORROW X TOGETHER", image: IMAGE_URLS.LEVEL },
      { id: 41, title: "Otonoke by Creepy Nuts", image: IMAGE_URLS.OTONOKE },
      { id: 42, title: "The Brave by YOASOBI", image: IMAGE_URLS.THE_BRAVE }
    ]
  }
];

const VotingApp: React.FC = () => {
  const [votes, setVotes] = useState<Votes>({});
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({});
  const [showResults, setShowResults] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalCategories: 0,
    userVotes: 0,
    totalNominees: 0,
    totalVotes: 0
  });
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  // Get user's votes and stats
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          
          // Get user's votes
          const { data: userVotes } = await supabase
            .from('votes')
            .select('category_id, nominee_id')
            .eq('user_id', user.id);

          if (userVotes) {
            const voteMap: Votes = {};
            userVotes.forEach(vote => {
              voteMap[vote.category_id] = vote.nominee_id;
            });
            setVotes(voteMap);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Get vote counts and stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total categories
        const { count: categoryCount } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });

        // Get total nominees
        const { count: nomineeCount } = await supabase
          .from('nominees')
          .select('*', { count: 'exact', head: true });

        // Get total votes from vote_counts table (sum of vote_count)
        const { data: totalVotesData, error: totalVotesError } = await supabase
          .from('vote_counts')
          .select('vote_count');

        let totalAggregatedVotes = 0;
        if (totalVotesData) {
          totalAggregatedVotes = totalVotesData.reduce((sum, row) => sum + row.vote_count, 0);
        } else if (totalVotesError) {
          console.error('Error fetching total aggregated votes:', totalVotesError);
        }

        // Get user's vote count only if user is logged in
        let userVoteCount = 0;
        if (user) {
          const { count } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          userVoteCount = count || 0;
        }

        // Get vote counts per nominee
        const { data: voteCountsData, error: voteCountsError } = await supabase
          .from('vote_counts')
          .select('*');

        if (voteCountsData) {
          console.log('Fetched voteCountsData:', voteCountsData);
          const voteCountMap: VoteCounts = {};
          voteCountsData.forEach(vc => {
            voteCountMap[`${vc.category_id}-${vc.nominee_id}`] = vc.vote_count;
          });
          setVoteCounts(voteCountMap);
          console.log('Populated voteCountMap:', voteCountMap);
        } else if (voteCountsError) {
           console.error('Error fetching vote counts:', voteCountsError);
        }

        setStats(prevStats => ({
          ...prevStats,
          totalCategories: categoryCount || 0,
          userVotes: userVoteCount,
          totalNominees: nomineeCount || 0,
          totalVotes: totalAggregatedVotes
        }));

      } catch (error) {
        console.error('Error in fetchStats:', error);
      }
    };

    // Fetch stats immediately and set up real-time subscription
    fetchStats();

    // Set up real-time subscription for votes
    const votesSubscription = supabase
      .channel('votes_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'votes' 
      }, () => {
        // Refetch stats when votes change
        fetchStats();
      })
      .subscribe();

    return () => {
      votesSubscription.unsubscribe();
    };
  }, [user]);

  const handleVote = async (categoryId: number, nomineeId: number) => {
    console.log(`Attempting to vote for Category: ${categoryId}, Nominee: ${nomineeId}`);
    if (!user) {
      console.log('User not signed in. Alerting user.');
      setSignInModalOpen(true);
      return;
    }
    
    try {
      console.log('Checking if category exists...');
      // First check if category exists
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', categoryId)
        .single();

      if (categoryError || !category) {
        console.error('Category not found:', categoryError);
        alert('Invalid category. Please try again.');
        return;
      }

      console.log('Checking if nominee exists...');
      // Check if nominee exists
      const { data: nominee, error: nomineeError } = await supabase
        .from('nominees')
        .select('id')
        .eq('id', nomineeId)
        .eq('category_id', categoryId)
        .single();

      if (nomineeError || !nominee) {
        console.error('Nominee not found:', nomineeError);
        alert('Invalid nominee. Please try again.');
        return;
      }

      console.log('Checking for existing vote...');
      // First check if user already voted in this category
      const { data: existingVote, error: checkError } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('category_id', categoryId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing vote:', checkError);
        throw checkError;
      }

      // If there's an existing vote, decrement the old nominee's vote count
      if (existingVote) {
        console.log(`Existing vote found for category ${categoryId}. Nominee ${existingVote.nominee_id}. Trigger should handle decrement.`);
      }

      console.log('Upserting vote...');
      // Save or update vote to Supabase
      const { error: upsertError } = await supabase
        .from('votes')
        .upsert({
          user_id: user.id,
          category_id: categoryId,
          nominee_id: nomineeId,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,category_id'
        });

      if (upsertError) {
        console.error('Error saving vote:', upsertError);
        throw upsertError;
      }

      // Remove manual increment - should be handled by trigger

      // Update local state to reflect the vote immediately (optional but good UX)
      setVotes(prev => ({
        ...prev,
        [categoryId]: nomineeId
      }));

      console.log('Vote saved successfully');
    } catch (error) {
      console.error('Error saving vote:', error);
      alert('Error saving vote. Please try again.');
    }
  };

  const totalVotes = Object.values(votes).length;

  console.log('Rendering with voteCounts state:', voteCounts);

  return (
    <div className={`min-h-screen w-full text-gray-300`}> 
      
      <div className="w-full px-4 py-2 pt-16 pb-20 overflow-y-auto" >
        <div className="mb-4 text-center">
          <Image
            src="/logo.png"
            alt="Subhasha Anime Awards Logo"
            width={120}
            height={120}
            className="mx-auto mb-2"
          />
          <h1 className="text-xl font-bold italic text-gray-300">Subhasha is doing a poll because crunchyroll couldnt do it</h1>
        </div>
        {/* Header Stats - Make it scrollable on mobile */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
 
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className={`bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm`}>
              <h3 className={`text-sm font-semibold text-[#FFD700] mb-1`}>Categories</h3>
              <p className={`text-xl font-bold text-white`}>{stats.totalCategories}</p>
            </div>
            <div className={`bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm`}>
              <h3 className={`text-sm font-semibold text-[#FFD700] mb-1`}>Your Votes</h3>
              <p className={`text-xl font-bold text-white`}>{stats.userVotes}</p>
            </div>
            <div className={`bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm`}>
              <h3 className={`text-sm font-semibold text-[#FFD700] mb-1`}>Total Nominees</h3>
              <p className={`text-xl font-bold text-white`}>{stats.totalNominees}</p>
            </div>
            <div className={`bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm`}>
              <h3 className={`text-sm font-semibold text-[#FFD700] mb-1`}>Total Votes</h3>
              <p className={`text-xl font-bold text-white`}>{stats.totalVotes.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Progress and Instructions - More compact on mobile */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#FFD700]">Voting Progress</h2>
            <span className="text-sm text-white">{totalVotes} / {CATEGORIES.length}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mb-4">
            <div 
              className="bg-[#FFD700] h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(totalVotes / CATEGORIES.length) * 100}%` }}
            />
          </div>
          <div className="space-y-1 text-gray-300">
            <h3 className="text-base font-semibold text-[#FFD700] mb-1">How to Vote</h3>
            <ul className="list-disc list-inside space-y-0.5 text-sm text-white/80">
              <li>Click on your favorite nominee in each category</li>
              <li>You can vote in multiple categories</li>
              <li>Change your vote anytime before voting closes</li>
              <li>Toggle "Show Results" to see live vote counts</li>
            </ul>
          </div>
        </div>

        {/* Toggle Results Button - More compact on mobile */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowResults(!showResults)}
            className={`bg-[#FFD700] text-[#1a1a1a] px-4 py-2 rounded-full font-bold text-base shadow-lg hover:bg-[#FFE44D] transition-colors duration-300`}
          >
            {showResults ? 'Hide Results' : 'Show Results'}
          </button>
        </div>

        {/* Categories - Improved mobile layout */}
        <div className="space-y-8">
          {CATEGORIES.map((category) => {
            const categoryVoteCounts = voteCounts;
            const totalCategoryVotes = category.nominees.reduce(
              (acc, n) => acc + (categoryVoteCounts[`${category.id}-${n.id}`] || 0),
              0
            );

            return (
              <motion.section
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <category.icon className="w-5 h-5 text-[#FFD700]" />
                    <h2 className="text-lg font-bold text-[#FFD700]">{category.name}</h2>
                  </div>
                  {category.isNew && (
                    <span className="bg-[#FFD700] text-[#1a1a1a] px-2 py-0.5 rounded-full text-xs font-bold">
                      NEW!
                    </span>
                  )}
                </div>

                {/* Improved grid for mobile - Make cards more compact */}
                <div className="grid grid-cols-2 gap-2">
                  {category.nominees.map((nominee) => {
                    const isSelected = votes[category.id] === nominee.id;
                    const voteCount = categoryVoteCounts[`${category.id}-${nominee.id}`] || 0;
                    const percentage = totalCategoryVotes > 0 ? ((voteCount / totalCategoryVotes) * 100).toFixed(1) : '0.0';

                    return (
                      <motion.div
                        key={nominee.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative group cursor-pointer transition-all duration-300 ${
                          isSelected ? 'scale-105 ring-2 ring-[#FFD700]' : 'hover:scale-102'
                        }`}
                        onClick={() => handleVote(category.id, nominee.id)}
                      >
                        <div className="relative overflow-hidden rounded-lg bg-white/5 border border-white/10">
                          <div className="aspect-[4/5] overflow-hidden">
                            <Image
                              src={nominee.image}
                              alt={nominee.title}
                              width={300}
                              height={400}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <h4 className="text-white font-semibold text-xs mb-0.5 line-clamp-1 sm:line-clamp-2">
                              {nominee.title}
                            </h4>

                            {showResults && (
                              <div className="space-y-0.5">
                                <div className="flex justify-between text-[10px] text-white/80">
                                  <span>{voteCount} votes</span>
                                  <span>{percentage}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-0.5">
                                  <div 
                                    className="bg-[#FFD700] h-0.5 rounded-full transition-all duration-1000"
                                    style={{ width: `${(voteCount / totalCategoryVotes) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-[#FFD700] rounded-full p-0.5">
                              <Heart className="w-2.5 h-2.5 text-[#1a1a1a] fill-current" />
                            </div>
                          )}

                          {!showResults && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Vote className="w-4 h-4 text-[#FFD700]" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>

      {/* Sign In Modal */}
      {signInModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[101]">
          <div className="bg-[#1a1a1a] text-white p-6 sm:p-8 rounded-lg shadow-xl border border-[#3a3a3a] max-w-sm w-full text-center relative">
            <button 
              onClick={() => setSignInModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#FFD700]">Sign In Required</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-6">You need to be signed in to cast your vote.</p>
            <Link href="/auth">
              <button
                onClick={() => setSignInModalOpen(false)}
                className="bg-[#FFD700] text-[#1a1a1a] px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-base sm:text-lg shadow-lg hover:bg-[#FFE44D] transition-colors duration-300 w-full"
              >
                Go to Sign In Page
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingApp;
