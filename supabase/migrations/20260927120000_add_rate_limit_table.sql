-- Durable, cross-instance rate limiting backed by Postgres. Replaces the
-- in-memory-only limiter (src/lib/rate-limit.server.ts), which resets on
-- every cold start / serverless instance and therefore barely limits
-- anything once deployed on Vercel.

CREATE TABLE IF NOT EXISTS public.rate_limit_hits (
  bucket text NOT NULL,
  client_key text NOT NULL,
  hit_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rate_limit_hits_lookup_idx
  ON public.rate_limit_hits (bucket, client_key, hit_at DESC);

ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated: this table is only ever touched
-- through check_rate_limit(), which runs as service_role.
GRANT ALL ON public.rate_limit_hits TO service_role;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_bucket text,
  p_client_key text,
  p_max_per_window int,
  p_window_seconds int
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
BEGIN
  DELETE FROM public.rate_limit_hits
  WHERE bucket = p_bucket
    AND client_key = p_client_key
    AND hit_at < now() - make_interval(secs => p_window_seconds);

  SELECT count(*) INTO v_count
  FROM public.rate_limit_hits
  WHERE bucket = p_bucket AND client_key = p_client_key;

  IF v_count >= p_max_per_window THEN
    RETURN true;
  END IF;

  INSERT INTO public.rate_limit_hits (bucket, client_key) VALUES (p_bucket, p_client_key);
  RETURN false;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, int, int) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, int, int) TO service_role;

-- Housekeeping: nothing prunes rate_limit_hits rows for keys that stop
-- sending requests. Cheap enough at this traffic volume; revisit with a
-- scheduled DELETE (pg_cron) if the table grows unexpectedly large.
