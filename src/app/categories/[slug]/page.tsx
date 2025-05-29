import { supabase } from '@/lib/supabase';
import { Category, Nominee } from '@/types';
import { CategoryContent } from './CategoryContent';

interface PageProps {
  params: {
    slug: string;
  };
}

interface VoteCount {
  nominee_id: number;
  vote_count: number;
}

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCategory:', error);
    return null;
  }
}

async function getNominees(categoryId: number): Promise<Nominee[]> {
  try {
    const { data, error } = await supabase
      .from('nominees')
      .select('*')
      .eq('category_id', categoryId)
      .order('title');
    
    if (error) {
      console.error('Error fetching nominees:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getNominees:', error);
    return [];
  }
}

async function getVoteCounts(categoryId: number): Promise<VoteCount[]> {
  try {
    const { data, error } = await supabase
      .from('vote_counts')
      .select('*')
      .eq('category_id', categoryId);
    
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

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCategory(params.slug);
  
  if (!category) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-[#FFD700]">Category not found</h1>
            <p className="text-gray-400 mt-4">The category you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const [nominees, voteCounts] = await Promise.all([
    getNominees(category.id),
    getVoteCounts(category.id)
  ]);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategoryContent 
          category={category}
          nominees={nominees}
          voteCounts={voteCounts}
        />
      </div>
    </div>
  );
}