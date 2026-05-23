import { useState } from 'react';

export interface ParseResponse {
    parsed_jd: any;
    parsed_resume: any;
    raw_resume: string;
}

export function useParser() {
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const parse = async (file: File, jobDescription: string): Promise<ParseResponse | null> => {
        setIsParsing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('resume_file', file);
            formData.append('job_description', jobDescription);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/parse/`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to parse document');
            }

            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message || 'An error occurred during parsing');
            return null;
        } finally {
            setIsParsing(false);
        }
    };

    return { parse, isParsing, error };
}
