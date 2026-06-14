-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.USERS (
  id uuid NOT NULL,
  name text NOT NULL,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT USERS_pkey PRIMARY KEY (id)
);
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
CREATE TABLE public.USER_RESUME (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  resume_file text,
  parsed_text json NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT USER_RESUME_pkey PRIMARY KEY (id),
  CONSTRAINT USER_RESUME_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS(id)
);
CREATE TABLE public.SAVED_JOBS (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  job_id text NOT NULL,
  job_title text,
  employer_name text,
  employer_logo text,
  employer_website text,
  job_publisher text,
  job_employment_type text,
  job_employment_types ARRAY,
  job_apply_link text,
  job_apply_is_direct boolean,
  job_description text,
  job_is_remote boolean,
  job_location text,
  job_city text,
  job_state text,
  job_country text,
  job_latitude double precision,
  job_longitude double precision,
  job_posted_at text,
  job_posted_at_timestamp bigint,
  job_posted_at_datetime_utc timestamp with time zone,
  job_salary text,
  job_salary_string text,
  job_min_salary numeric,
  job_max_salary numeric,
  job_salary_period text,
  job_benefits jsonb,
  job_benefits_strings ARRAY,
  job_highlights jsonb,
  employer_reviews jsonb,
  job_google_link text,
  apply_options jsonb,
  job_onet_soc text,
  job_onet_job_zone text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT SAVED_JOBS_pkey PRIMARY KEY (id),
  CONSTRAINT fk_saved_jobs_user FOREIGN KEY (user_id) REFERENCES public.USERS(id)
);