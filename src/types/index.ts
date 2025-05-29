export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  is_new?: boolean;
  iconName: string;
}

export interface Nominee {
  id: number;
  title: string;
  image: string;
  description?: string;
  category_id: number;
}

export interface VoteCountNomineeData {
  id: number;
  title: string;
  image: string;
}

export interface CategoryNominee {
  id: number;
  category_id: number;
  nominee_id: number;
}

export interface Vote {
  id: number;
  user_id: string;
  category_id: number;
  nominee_id: number;
  created_at: string;
}

export interface VoteCount {
  category_id: number;
  nominee_id: number;
  vote_count: number;
  nominees: VoteCountNomineeData[];
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
} 