
CREATE TABLE public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  creator text,
  contributor text,
  subject text[] DEFAULT '{}',
  publisher text,
  series text,
  language text DEFAULT 'ind',
  type text DEFAULT 'Text',
  identifier text,
  description text,
  coverage text,
  marc_record text,
  cover_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Books are viewable by everyone"
  ON public.books FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert books"
  ON public.books FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update books"
  ON public.books FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete books"
  ON public.books FOR DELETE
  USING (true);

CREATE INDEX books_title_idx ON public.books USING gin (to_tsvector('simple', title));
CREATE INDEX books_creator_idx ON public.books (creator);
