-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.
CREATE TABLE public.ANALYSIS_JOB (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  generation_name text NOT NULL,
  user_id uuid NOT NULL,
  resume_file text,
  parsed_resume json,
  job_desc text,
  parsed_job_desc json,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ANALYSIS_JOB_pkey PRIMARY KEY (id),
  CONSTRAINT ANALYSIS_JOB_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS(id)
);
CREATE TABLE public.ANALYSIS_RESULT (
  result_id uuid NOT NULL DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL,
  match_result json,
  ats_result json,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ANALYSIS_RESULT_pkey PRIMARY KEY (result_id),
  CONSTRAINT ANALYSIS_RESULT_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.ANALYSIS_JOB(id)
);
CREATE TABLE public.GENERATION_RESULT (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cover_letter text,
  cover_email text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  job_id uuid NOT NULL,
  CONSTRAINT GENERATION_RESULT_pkey PRIMARY KEY (id),
  CONSTRAINT GENERATION_RESULT_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS(id),
  CONSTRAINT GENERATION_RESULT_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.ANALYSIS_JOB(id)
);
CREATE TABLE public.STATISTICS (
  user_id uuid NOT NULL,
  total_generation smallint DEFAULT '0'::smallint,
  saved_letters smallint DEFAULT '0'::smallint,
  job_searches smallint DEFAULT '0'::smallint,
  average_job_match smallint DEFAULT '0'::smallint,
  average_ats_score smallint DEFAULT '0'::smallint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT STATISTICS_pkey PRIMARY KEY (user_id),
  CONSTRAINT STATISTICS_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS(id)
);
CREATE TABLE public.USERS (
  id uuid NOT NULL,
  name text NOT NULL,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT USERS_pkey PRIMARY KEY (id)
);