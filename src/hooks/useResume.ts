import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export interface SavedResume {
    user_id: string;
    resume_file: string;
    parsed_text: any;
    created_at: string;
}

export function useResume() {
    const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
    const [activeResume, setActiveResume] = useState<SavedResume | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch previously used resumes
    const fetchSavedResumes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            const { data, error } = await supabase
                .from('USER_RESUME')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Supabase fetch error:", error);
                throw error;
            }

            console.log("Fetch success:", data);
            setSavedResumes(data || []);
            if (data && data.length > 0) {
                setActiveResume(data[0]);
            }
            return data || [];
        } catch (err: any) {
            console.error("Error in fetchSavedResumes:", err);
            setError(err.message || 'Failed to fetch saved resumes');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Upload and parse new resume
    const uploadNewResume = async (file: File) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            // 1. Upload to Supabase 'resumes' bucket
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Parse the resume using backend endpoint
            const formData = new FormData();
            formData.append('resume_file', file);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetchWithAuth(`${apiUrl}/api/parse/resume`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error("Backend Error on Parse:", errText);
                throw new Error(`Failed to parse document: ${response.status}`);
            }

            const parsedData = await response.json(); // assuming it returns the parsed resume JSON

            // 3. Store in USER_RESUME table (insert new resume)
            const { data: insertData, error: insertError } = await supabase
                .from('USER_RESUME')
                .insert({
                    user_id: user.id,
                    resume_file: file.name,
                    parsed_text: parsedData.parsed_resume || parsedData,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (insertError) {
                console.error("Supabase Insert Error:", insertError);
                throw insertError;
            }

            console.log("Successfully inserted resume into DB:", insertData);
            setSavedResumes(prev => [insertData, ...prev]);
            setActiveResume(insertData);
            return insertData;

        } catch (err: any) {
            console.error("Resume Upload Final Catch Error:", err);
            setError(err.message || 'An error occurred during resume upload');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        savedResumes,
        activeResume,
        setActiveResume,
        isLoading,
        error,
        fetchSavedResumes,
        uploadNewResume
    };
}
