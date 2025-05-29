-- Create vote_counts table if it doesn't exist
CREATE TABLE IF NOT EXISTS vote_counts (
  category_id INTEGER REFERENCES categories(id),
  nominee_id INTEGER REFERENCES nominees(id),
  vote_count INTEGER DEFAULT 0,
  PRIMARY KEY (category_id, nominee_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vote_counts_category_nominee 
ON vote_counts(category_id, nominee_id);

-- Initialize vote counts for existing nominees
INSERT INTO vote_counts (category_id, nominee_id, vote_count)
SELECT category_id, id, 0
FROM nominees
ON CONFLICT (category_id, nominee_id) DO NOTHING; 