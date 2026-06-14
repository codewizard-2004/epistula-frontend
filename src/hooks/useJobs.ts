import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Job {
    job_id: string;
    job_title: string;
    employer_name: string;
    employer_logo: string | null;
    job_description: string;
    job_apply_link: string;
    job_city?: string;
    job_state?: string;
    job_country?: string;
    job_is_remote?: boolean;
    job_posted_at_datetime_utc?: string;
    job_employment_type?: string;
}

export function useJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedJobs = sessionStorage.getItem('saved_jobs');
        if (storedJobs) {
            try {
                setJobs(JSON.parse(storedJobs));
            } catch (e) {
                console.error("Failed to parse saved jobs", e);
            }
        }
    }, []);

    const searchJobs = async (prompt: string, page: number = 1, num_pages: number = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth(`${apiUrl}/api/jobs/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, page, num_pages }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to fetch jobs');
            }

            const data = await response.json();
            let fetchedJobs: Job[] = [];
            // JSearch API typically returns an array of jobs in the `data` property
            if (data && data.data) {
                fetchedJobs = data.data;
            } else if (Array.isArray(data)) {
                fetchedJobs = data;
            }
            
            setJobs(fetchedJobs);
            sessionStorage.setItem('saved_jobs', JSON.stringify(fetchedJobs));
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            setJobs([]);
            sessionStorage.removeItem('saved_jobs');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        jobs,
        isLoading,
        error,
        searchJobs,
    };
}
