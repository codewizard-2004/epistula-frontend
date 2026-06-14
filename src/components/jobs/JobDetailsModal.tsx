import React, { useEffect, useRef, useState } from 'react';
import { Job } from '@/hooks/useJobs';
import { useResume } from '@/hooks/useResume';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { supabase } from '@/lib/supabase';

interface JobDetailsModalProps {
    job: Job | null;
    isOpen: boolean;
    onClose: () => void;
    onCheckMatch?: (job: Job) => void;
}

export default function JobDetailsModal({ job, isOpen, onClose, onCheckMatch }: JobDetailsModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
    const [isMatching, setIsMatching] = useState(false);
    const { fetchSavedResumes } = useResume();

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen && job && job.job_description) {
            setMatchPercentage(null); // Reset when job changes or modal opens

            const checkQuickMatch = async () => {
                setIsMatching(true);
                try {
                    const resumes = await fetchSavedResumes();
                    if (!resumes || resumes.length === 0 || !resumes[0].parsed_text) {
                        setIsMatching(false);
                        return;
                    }
                    const resume = resumes[0];

                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                    const response = await fetchWithAuth(`${apiUrl}/api/analyze/matching`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            jd: job.job_description,
                            parsed_resume: resume.parsed_text
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.matching_percentage !== undefined) {
                            setMatchPercentage(data.matching_percentage);
                        }
                    }
                } catch (e) {
                    console.error("Failed to check quick match", e);
                } finally {
                    setIsMatching(false);
                }
            };

            checkQuickMatch();
        }
    }, [isOpen, job]);

    useEffect(() => {
        if (isOpen && job) {
            const checkSavedStatus = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                
                const { data } = await supabase
                    .from('SAVED_JOBS')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('job_id', job.job_id)
                    .maybeSingle();
                
                setIsSaved(!!data);
            };
            checkSavedStatus();
        }
    }, [isOpen, job]);

    const toggleSave = async () => {
        if (!job || isSaving) return;
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            if (isSaved) {
                await supabase
                    .from('SAVED_JOBS')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('job_id', job.job_id);
                setIsSaved(false);
            } else {
                await supabase
                    .from('SAVED_JOBS')
                    .insert({
                        user_id: user.id,
                        job_id: job.job_id,
                        job_title: job.job_title,
                        employer_name: job.employer_name,
                        employer_logo: job.employer_logo,
                        job_description: job.job_description,
                        job_apply_link: job.job_apply_link,
                        job_city: job.job_city,
                        job_state: job.job_state,
                        job_country: job.job_country,
                        job_is_remote: job.job_is_remote,
                        job_posted_at_datetime_utc: job.job_posted_at_datetime_utc,
                        job_employment_type: job.job_employment_type
                    });
                setIsSaved(true);
            }
        } catch (e) {
            console.error("Failed to toggle save job", e);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !job) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm">
                            {job.employer_logo ? (
                                <img
                                    src={job.employer_logo}
                                    alt={`${job.employer_name} logo`}
                                    className="w-full h-full object-contain p-2"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-gray-400 dark:text-gray-500">
                                    {job.employer_name?.charAt(0) || '?'}
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-3 flex-wrap">
                                {job.job_title}
                                {isMatching ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                        <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                                        Analyzing Match with resume
                                    </span>
                                ) : matchPercentage !== null ? (
                                    <span className={`inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-md ${matchPercentage >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        matchPercentage >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        <span className="material-symbols-outlined text-[16px]">
                                            {matchPercentage >= 80 ? 'check_circle' : matchPercentage >= 50 ? 'info' : 'warning'}
                                        </span>
                                        {matchPercentage}% Match
                                    </span>
                                ) : null}
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1 font-medium">
                                {job.employer_name}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {(job.job_city || job.job_country || job.job_is_remote) && (
                                    <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                        {job.job_is_remote ? 'Remote' : `${job.job_city || ''}${job.job_city && job.job_country ? ', ' : ''}${job.job_country || ''}`}
                                    </span>
                                )}
                                {job.job_posted_at_datetime_utc && (
                                    <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 ml-2">
                                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                                        {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">About the Role</h3>
                        <div className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                            {job.job_description || "No description provided."}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row justify-between gap-4 rounded-b-2xl">
                    <button
                        onClick={toggleSave}
                        disabled={isSaving}
                        className={`px-6 py-3 rounded-xl font-bold border transition-colors shadow-sm flex items-center justify-center gap-2 ${isSaved
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        {isSaving ? (
                            <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                        ) : (
                            <span className="material-symbols-outlined text-[20px]">
                                {isSaved ? 'bookmark_added' : 'bookmark'}
                            </span>
                        )}
                        {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Job'}
                    </button>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => onCheckMatch?.(job)}
                            className="px-6 py-3 rounded-xl font-bold bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">analytics</span>
                            Match Details
                        </button>
                        <a
                            href={job.job_apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                        >
                            Apply Now
                            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
