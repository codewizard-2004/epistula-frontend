"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useJobs, Job } from "@/hooks/useJobs";
import JobCard from "@/components/jobs/JobCard";
import JobDetailsModal from "@/components/jobs/JobDetailsModal";
import ResumeSelector from "@/components/jobs/ResumeSelector";
import { supabase } from "@/lib/supabase";

const PHRASES = [
    "Product Manager in New York",
    "Software Engineer in San Francisco",
    "UX Designer in London",
    "Data Scientist Remote",
    "Frontend Developer in Berlin"
];

export default function JobsPage() {
    const [placeholderText, setPlaceholderText] = useState("");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedJobsList, setSavedJobsList] = useState<Job[]>([]);
    const [showSavedJobs, setShowSavedJobs] = useState(true);
    const router = useRouter();

    const { jobs, isLoading, error, searchJobs } = useJobs();

    const fetchSavedJobs = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
            .from('SAVED_JOBS')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (data) {
            setSavedJobsList(data);
        }
    };

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        sessionStorage.setItem('saved_search_query', searchQuery);
        searchJobs(searchQuery);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleJobClick = (job: Job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleCheckMatch = (job: Job) => {
        if (job.job_description) {
            sessionStorage.setItem('pending_job_description', job.job_description);
        }
        router.push('/analyze');
    };

    useEffect(() => {
        const currentPhrase = PHRASES[phraseIndex];
        const typingSpeed = isDeleting ? 40 : 80;
        
        const timeout = setTimeout(() => {
            if (!isDeleting && placeholderText === currentPhrase) {
                // Pause at the end of typing before deleting
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && placeholderText === "") {
                // Move to next phrase after deleting
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
            } else {
                // Type or delete characters
                const nextPlaceholder = isDeleting 
                    ? currentPhrase.substring(0, placeholderText.length - 1)
                    : currentPhrase.substring(0, placeholderText.length + 1);
                setPlaceholderText(nextPlaceholder);
            }
        }, typingSpeed);
        
        return () => clearTimeout(timeout);
    }, [placeholderText, isDeleting, phraseIndex]);

    useEffect(() => {
        const savedQuery = sessionStorage.getItem('saved_search_query');
        if (savedQuery) {
            setSearchQuery(savedQuery);
        }
    }, []);

    return (
        <div className="bg-gray-100 dark:bg-[#111827] min-h-screen text-gray-800 dark:text-gray-100 overflow-hidden relative font-sans flex flex-col">
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-[80px]"></div>
            </div>

            <div className="w-full z-50 flex-shrink-0">
                <Navbar />
            </div>

            <div className="flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <main className="flex-1 flex flex-col items-center justify-center py-12">
                    <div className="w-full max-w-4xl text-center space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Your Next Great Role <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">is Waiting.</span>
                            </h2>
                            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                                Search through thousands of roles or let our AI match you based on your unique career history.
                            </p>
                        </div>

                        <div className="relative max-w-3xl mx-auto w-full group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/50 dark:border-gray-700">
                                <div className="flex-1 flex items-center pl-4">
                                    <span className="material-symbols-outlined text-gray-400 text-2xl">search</span>
                                    <input 
                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-lg py-4 px-4 text-gray-800 dark:text-white placeholder-gray-400" 
                                        placeholder={placeholderText || " "} 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                                <ResumeSelector />
                                <button 
                                    className="bg-[#1F2937] text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50"
                                    onClick={handleSearch}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                            Searching...
                                        </>
                                    ) : (
                                        'Search Jobs'
                                    )}
                                </button>
                            </div>
                        </div>

                        {savedJobsList.length > 0 && jobs.length === 0 && (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setShowSavedJobs(!showSavedJobs)}>
                                        <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                            <span className={`material-symbols-outlined transition-transform duration-300 ${showSavedJobs ? 'rotate-90' : ''}`}>chevron_right</span>
                                            Saved Jobs ({savedJobsList.length})
                                        </span>
                                    </div>
                                    
                                    {showSavedJobs && (
                                        <div className="w-full text-left space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {savedJobsList.map((job, idx) => (
                                                    <JobCard key={job.job_id || idx} job={job} onClick={handleJobClick} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 max-w-xs mx-auto"></div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        {jobs.length > 0 && (
                            <div className="w-full mt-12 text-left space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Found {jobs.length} roles matching "{searchQuery}"
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {jobs.map((job, idx) => (
                                        <JobCard key={job.job_id || idx} job={job} onClick={handleJobClick} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <footer className="py-8 text-center text-xs text-gray-400 dark:text-gray-600 flex-shrink-0">
                    <p>© 2024 Epistula AI. Empowering professional growth through intelligent matches.</p>
                </footer>
            </div>
            
            <JobDetailsModal 
                job={selectedJob} 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    // Refresh saved jobs list when modal closes in case user unsaved/saved
                    fetchSavedJobs();
                }} 
                onCheckMatch={handleCheckMatch}
            />
        </div>
    );
}
