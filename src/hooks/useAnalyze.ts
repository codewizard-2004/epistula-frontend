import { useState } from 'react';

export interface AnalyzeResponse {
    match_analysis: {
        score: number;
        matched_skills: string[];
        skill_gaps: string[];
        suggestions: string[];
    };
    ats_result: {
        score: number;
        issues: string[];
        suggestions: string[];
    };
}

export function useAnalyze() {
    const [isAnalyzingApi, setIsAnalyzingApi] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyze = async (parsed_jd: any, parsed_resume: any, raw_resume: string): Promise<AnalyzeResponse | null> => {
        setIsAnalyzingApi(true);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/analyze/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parsed_jd,
                    parsed_resume,
                    raw_resume
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze document');
            }

            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message || 'An error occurred during analysis');
            return null;
        } finally {
            setIsAnalyzingApi(false);
        }
    };

    return { analyze, isAnalyzingApi, error };
}
