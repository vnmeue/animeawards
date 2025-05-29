import { supabase } from '@/lib/supabase';
import { ResultsContent } from './ResultsContent';
import { Trophy, Film, Tv, Palette, Users, Music, Award, Sparkles } from 'lucide-react';

const CATEGORY_ICONS: { [key: string]: any } = {
  'anime-of-the-year': Trophy,
  'film-of-the-year': Film,
  'best-continuing-series': Tv,
  'best-background-art': Palette,
  'best-isekai-anime': Sparkles,
  'best-main-character': Users,
  'best-anime-song': Music
};

async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    // Add icons to categories
    return data?.map(category => ({
      ...category,
      icon: CATEGORY_ICONS[category.slug] || Trophy
    })) || [];
  } catch (error) {
    console.error('Error in getCategories:', error);
    return [];
  }
}

async function getVoteCounts() {
  try {
    const { data, error } = await supabase
      .from('vote_counts')
      .select(`
        category_id,
        nominee_id,
        vote_count,
        nominees (
          id,
          title,
          image
        )
      `);
    
    if (error) {
      console.error('Error fetching vote counts:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getVoteCounts:', error);
    return [];
  }
}

async function getTotalVotes() {
  try {
    const { count, error } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error fetching total votes:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getTotalVotes:', error);
    return 0;
  }
}

export default async function ResultsPage() {
  const [categories, voteCounts, totalVotes] = await Promise.all([
    getCategories(),
    getVoteCounts(),
    getTotalVotes()
  ]);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ResultsContent 
          categories={categories}
          voteCounts={voteCounts}
          totalVotes={totalVotes}
        />
      </div>
    </div>
  );
} 