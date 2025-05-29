"use client"
import React, { useState, useEffect } from 'react';
import { Heart, Star, Trophy, Film, Tv, Palette, Users, Music, Award, ChevronRight, Vote, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { IMAGE_URLS, ROUTES, COLORS } from '@/lib/constants';

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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [votes, setVotes] = useState<Votes>({});
  const [isVoting, setIsVoting] = useState(false);
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({});
  const [showResults, setShowResults] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalCategories: 0,
    userVotes: 0,
    totalNominees: 0,
    totalVotes: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        // Get total votes
        const { count: voteCount } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true });

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
        const { data: voteCounts } = await supabase
          .from('vote_counts')
          .select('*');

        if (voteCounts) {
          const voteCountMap: VoteCounts = {};
          voteCounts.forEach(vc => {
            voteCountMap[`${vc.category_id}-${vc.nominee_id}`] = vc.vote_count;
          });
          setVoteCounts(voteCountMap);
        }

        setStats({
          totalCategories: categoryCount || 0,
          userVotes: userVoteCount,
          totalNominees: nomineeCount || 0,
          totalVotes: voteCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
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
  }, [user]); // Only re-run if user changes

  // Initialize database with categories and nominees
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // First check if categories exist
        const { count: categoryCount } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });

        // If no categories exist, create them
        if (categoryCount === 0) {
          console.log('Initializing categories...');
          const { error: categoryError } = await supabase
            .from('categories')
            .insert(CATEGORIES.map(cat => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              is_new: cat.isNew
            })));

          if (categoryError) {
            console.error('Error creating categories:', categoryError);
            return;
          }

          // Create nominees
          console.log('Initializing nominees...');
          const nomineeEntries = CATEGORIES.flatMap(category =>
            category.nominees.map(nominee => ({
              id: nominee.id,
              category_id: category.id,
              title: nominee.title,
              image: nominee.image
            }))
          );

          const { error: nomineeError } = await supabase
            .from('nominees')
            .insert(nomineeEntries);

          if (nomineeError) {
            console.error('Error creating nominees:', nomineeError);
            return;
          }

          console.log('Database initialized successfully');
        }
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
  }, []);

  const handleVote = async (categoryId: number, nomineeId: number) => {
    if (!user) {
      alert('Please sign in to vote');
      return;
    }
    
    setIsVoting(true);
    try {
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
        const { error: decrementError } = await supabase
          .from('vote_counts')
          .update({ vote_count: supabase.rpc('decrement_vote_count') })
          .eq('category_id', categoryId)
          .eq('nominee_id', existingVote.nominee_id);

        if (decrementError) {
          console.error('Error decrementing old vote count:', decrementError);
          throw decrementError;
        }
      }

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

      // Update vote count for the new nominee
      const { error: incrementError } = await supabase
        .from('vote_counts')
        .upsert({
          category_id: categoryId,
          nominee_id: nomineeId,
          vote_count: 1
        }, {
          onConflict: 'category_id,nominee_id',
          count: 'exact'
        });

      if (incrementError) {
        console.error('Error incrementing vote count:', incrementError);
        throw incrementError;
      }

      // Update local state
      setVotes(prev => ({
        ...prev,
        [categoryId]: nomineeId
      }));

      // Update vote counts
      setVoteCounts(prev => ({
        ...prev,
        [`${categoryId}-${nomineeId}`]: (prev[`${categoryId}-${nomineeId}`] || 0) + 1
      }));

      // Update user's vote count
      setStats(prev => ({
        ...prev,
        userVotes: prev.userVotes + (existingVote ? 0 : 1)
      }));

      console.log('Vote saved successfully');
    } catch (error) {
      console.error('Error saving vote:', error);
      alert('Error saving vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleSubmitVotes = async () => {
    if (!user) {
      alert('Please sign in to submit votes');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Get existing votes for this user
      const { data: existingVotes, error: fetchError } = await supabase
        .from('votes')
        .select('category_id, nominee_id')
        .eq('user_id', user.id);

      if (fetchError) {
        console.error('Error fetching existing votes:', fetchError);
        throw fetchError;
      }

      // Create a map of existing votes
      const existingVoteMap = new Map(
        existingVotes?.map(vote => [vote.category_id, vote.nominee_id]) || []
      );

      // Prepare vote entries, only including new or changed votes
      const voteEntries = Object.entries(votes)
        .filter(([categoryId, nomineeId]) => {
          const existingNomineeId = existingVoteMap.get(parseInt(categoryId));
          return !existingNomineeId || existingNomineeId !== nomineeId;
        })
        .map(([categoryId, nomineeId]) => ({
          user_id: user.id,
          category_id: parseInt(categoryId),
          nominee_id: nomineeId,
          created_at: new Date().toISOString()
        }));

      if (voteEntries.length === 0) {
        alert('No new votes to submit!');
        return;
      }

      // Save votes to Supabase
      const { error: upsertError } = await supabase
        .from('votes')
        .upsert(voteEntries, {
          onConflict: 'user_id,category_id'
        });

      if (upsertError) {
        console.error('Error submitting votes:', upsertError);
        throw upsertError;
      }

      // Update total votes count
      setStats(prev => ({
        ...prev,
        totalVotes: prev.totalVotes + voteEntries.length
      }));

      alert('Votes submitted successfully!');
    } catch (error) {
      console.error('Error submitting votes:', error);
      alert('Error submitting votes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVotes = Object.values(votes).length;
  const allCategoriesVoted = totalVotes === CATEGORIES.length;

  return (
    <div className={`min-h-screen bg-[${COLORS.BACKGROUND}]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className={`bg-[${COLORS.CARD_BACKGROUND}] rounded-xl p-6 border border-[${COLORS.BORDER}]`}>
            <h3 className={`text-lg font-semibold text-[${COLORS.ACCENT}] mb-2`}>Categories</h3>
            <p className={`text-3xl font-bold text-[${COLORS.TEXT_PRIMARY}]`}>{stats.totalCategories}</p>
          </div>
          <div className={`bg-[${COLORS.CARD_BACKGROUND}] rounded-xl p-6 border border-[${COLORS.BORDER}]`}>
            <h3 className={`text-lg font-semibold text-[${COLORS.ACCENT}] mb-2`}>Your Votes</h3>
            <p className={`text-3xl font-bold text-[${COLORS.TEXT_PRIMARY}]`}>{stats.userVotes}</p>
          </div>
          <div className={`bg-[${COLORS.CARD_BACKGROUND}] rounded-xl p-6 border border-[${COLORS.BORDER}]`}>
            <h3 className={`text-lg font-semibold text-[${COLORS.ACCENT}] mb-2`}>Total Nominees</h3>
            <p className={`text-3xl font-bold text-[${COLORS.TEXT_PRIMARY}]`}>{stats.totalNominees}</p>
          </div>
          <div className={`bg-[${COLORS.CARD_BACKGROUND}] rounded-xl p-6 border border-[${COLORS.BORDER}]`}>
            <h3 className={`text-lg font-semibold text-[${COLORS.ACCENT}] mb-2`}>Total Votes</h3>
            <p className={`text-3xl font-bold text-[${COLORS.TEXT_PRIMARY}]`}>{stats.totalVotes.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress and Instructions */}
        <div className="bg-[#242424] rounded-xl p-6 border border-[#333333] mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#FFD700]">Voting Progress</h2>
            <span className="text-white">{totalVotes} / {CATEGORIES.length} categories</span>
          </div>
          <div className="w-full bg-[#333333] rounded-full h-2 mb-6">
            <div 
              className="bg-[#FFD700] h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(totalVotes / CATEGORIES.length) * 100}%` }}
            />
          </div>
          <div className="space-y-2 text-gray-300">
            <h3 className="text-lg font-semibold text-[#FFD700] mb-2">How to Vote</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Click on your favorite nominee in each category</li>
              <li>You can vote in multiple categories</li>
              <li>Change your vote anytime before voting closes</li>
              <li>Toggle "Show Results" to see live vote counts</li>
            </ul>
          </div>
        </div>

        {/* Submit Button - Only show when all categories are voted */}
        {allCategoriesVoted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <button
              onClick={handleSubmitVotes}
              disabled={isSubmitting}
              className={`bg-[#FFD700] text-[#1a1a1a] px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-[#FFE44D] transition-colors duration-300 flex items-center gap-2 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  Submit All Votes
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Categories */}
        <div className="space-y-12">
          {CATEGORIES.map((category) => (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#242424] rounded-xl p-6 border border-[#333333]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <category.icon className="w-6 h-6 text-[#FFD700]" />
                  <h2 className="text-2xl font-bold text-[#FFD700]">{category.name}</h2>
                </div>
                {category.isNew && (
                  <span className="bg-[#FFD700] text-[#1a1a1a] px-3 py-1 rounded-full text-sm font-bold">
                    NEW!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.nominees.map((nominee) => {
                  const isSelected = votes[category.id] === nominee.id;
                  const voteCount = voteCounts[`${category.id}-${nominee.id}`] || 0;
                  const totalCategoryVotes = category.nominees.reduce(
                    (acc, n) => acc + (voteCounts[`${category.id}-${n.id}`] || 0),
                    0
                  );

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
                      <div className="relative overflow-hidden rounded-xl bg-[#1a1a1a] border border-[#333333]">
                        <div className="aspect-[3/4] overflow-hidden">
                          <Image
                            src={nominee.image}
                            alt={nominee.title}
                            width={300}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h4 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                            {nominee.title}
                          </h4>

                          {showResults && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-gray-300">
                                <span>{voteCount} votes</span>
                                <span>{((voteCount / totalCategoryVotes) * 100).toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-[#333333] rounded-full h-1.5">
                                <div 
                                  className="bg-[#FFD700] h-1.5 rounded-full transition-all duration-1000"
                                  style={{ width: `${(voteCount / totalCategoryVotes) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-[#FFD700] rounded-full p-1">
                            <Heart className="w-4 h-4 text-[#1a1a1a] fill-current" />
                          </div>
                        )}

                        {!showResults && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Vote className="w-8 h-8 text-[#FFD700]" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingApp;
