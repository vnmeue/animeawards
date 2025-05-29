
CREATE OR REPLACE FUNCTION decrement_vote_count()
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN vote_count - 1;
END;
$$;


CREATE OR REPLACE FUNCTION increment_vote_count()
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN vote_count + 1;
END;
$$;


CREATE OR REPLACE FUNCTION update_vote_count_on_vote()
RETURNS TRIGGER AS $$
BEGIN

  INSERT INTO vote_counts (category_id, nominee_id, vote_count)
  VALUES (NEW.category_id, NEW.nominee_id, 1)
  ON CONFLICT (category_id, nominee_id)
  DO UPDATE SET vote_count = vote_counts.vote_count + 1;


  IF TG_OP = 'UPDATE' AND OLD.nominee_id != NEW.nominee_id THEN
    UPDATE vote_counts
    SET vote_count = vote_count - 1
    WHERE category_id = OLD.category_id
    AND nominee_id = OLD.nominee_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS update_vote_count_trigger ON votes;
CREATE TRIGGER update_vote_count_trigger
  AFTER INSERT OR UPDATE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_count_on_vote();

CREATE OR REPLACE FUNCTION decrement_vote_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vote_counts
  SET vote_count = vote_count - 1
  WHERE category_id = OLD.category_id
  AND nominee_id = OLD.nominee_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS decrement_vote_count_trigger ON votes;
CREATE TRIGGER decrement_vote_count_trigger
  AFTER DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_vote_count_on_delete(); 
