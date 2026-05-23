"use client";

import styles from "./result.module.css";
import Navbar from "@/components/Navbar";
import ATSScoreCircle from "@/components/ATSScoreCircle";
import MatchScoreCard from "@/components/MatchScoreCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Tag = ({ text }: { text: string }) => (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50">
        {text}
    </span>
);

function ResultSkeleton() {
    return (
        <div className={styles.container}>
            <div className={styles.bgEffects}>
                <div className={styles.bgGradient}></div>
                <div className={styles.blob1}></div>
                <div className={styles.blob2}></div>
            </div>

            <div className="flex flex-col flex-grow">
                <header className="flex flex-col md:flex-row items-center justify-between py-6 px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-64 mb-2"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48 mt-1"></div>
                    </div>
                </header>

                <main className={styles.main}>
                    <div className={styles.scrollArea}>
                        <div className={styles.grid}>
                            <div className={styles.sidebar}>
                                <div className="h-64 bg-slate-300/70 dark:bg-slate-700/80 rounded-[2rem] animate-pulse shadow-sm"></div>
                                <div className="h-48 bg-slate-300/70 dark:bg-slate-700/80 rounded-[2rem] animate-pulse mt-6 shadow-sm"></div>
                                <div className="h-14 bg-slate-300/70 dark:bg-slate-700/80 rounded-xl mt-6 animate-pulse shadow-sm"></div>
                            </div>

                            <div className={styles.content}>
                                <div className={`${styles.sectionRequirements} animate-pulse`}>
                                    <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-1/3 mb-4"></div>
                                    <div className="flex gap-2">
                                        <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-full w-20"></div>
                                        <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-full w-24"></div>
                                        <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-full w-16"></div>
                                    </div>
                                </div>
                                <div className={`${styles.sectionImprovements} animate-pulse h-[500px]`}>
                                    <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-1/3 mb-6"></div>
                                    <div className="space-y-4">
                                        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                                        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                                        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function ResultContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    
    const [result, setResult] = useState<any>(null);
    const [jobName, setJobName] = useState<string>("Job Analysis");
    const [isLoading, setIsLoading] = useState(true);
    const [showAllSuggestions, setShowAllSuggestions] = useState(false);
    const [showAllATS, setShowAllATS] = useState(false);

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        const fetchResult = async () => {
            try {
                const { data, error } = await supabase
                    .from('ANALYSIS_RESULT')
                    .select(`
                        *,
                        ANALYSIS_JOB (
                            generation_name,
                            parsed_job_desc
                        )
                    `)
                    .eq('result_id', id)
                    .single();

                if (error) throw error;
                
                if (data) {
                    setResult(data);
                    if (data.ANALYSIS_JOB) {
                        setJobName(data.ANALYSIS_JOB.generation_name || "Job Analysis");
                    }
                }
            } catch (err) {
                console.error("Failed to fetch result", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResult();
    }, [id]);

    if (isLoading) {
        return <ResultSkeleton />;
    }

    if (!result) {
        return <div className="min-h-screen flex items-center justify-center dark:text-white">Analysis not found.</div>;
    }

    const suggestions = result.match_result?.suggestions || [];
    const displayedSuggestions = showAllSuggestions ? suggestions : suggestions.slice(0, 3);

    const atsIssues = result.ats_result?.issues || [];
    const displayedIssues = showAllATS ? atsIssues : atsIssues.slice(0, 3);

    return (
        <div className={styles.container}>
            <div className={styles.bgEffects}>
                <div className={styles.bgGradient}></div>
                <div className={styles.blob1}></div>
                <div className={styles.blob2}></div>
            </div>

            <div className="flex flex-col flex-grow">
                <header className="flex flex-col md:flex-row items-center justify-between py-6 px-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold tracking-tight dark:text-white leading-none">Analysis Results</h1>
                            {id && (
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center gap-1">
                                    <span className="material-icons-round text-[10px]">history</span>
                                    Saved
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review your resume performance for "{jobName}"</p>
                    </div>
                </header>

                <main className={styles.main}>
                    <div className={styles.scrollArea}>
                        <div className={styles.grid}>
                            <div className={styles.sidebar}>
                                <ATSScoreCircle
                                    score={result.ats_result?.score || 0}
                                    label={result.ats_result?.score > 80 ? "Excellent" : "Needs Improvement"}
                                    description="Your resume parses well on most Applicant Tracking Systems."
                                />

                                <MatchScoreCard
                                    score={result.match_result?.score || 0}
                                    targetRole={result.ANALYSIS_JOB?.parsed_job_desc?.title || "Target Role"}
                                    company={result.ANALYSIS_JOB?.parsed_job_desc?.company || "Company"}
                                    tags={[
                                        `Matched: ${result.match_result?.matched_skills?.length || 0}`,
                                        `Gaps: ${result.match_result?.skill_gaps?.length || 0}`
                                    ]}
                                />

                                <div className="mt-6">
                                    <Link href={`/analyze/generation?id=${result.result_id}`} className={styles.buttonPrimary}>
                                        <span className="material-icons-round">auto_awesome</span>
                                        Generate Drafts
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.content}>
                                {/* Missing Requirements */}
                                <div className={styles.sectionRequirements}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                                                <span className="material-icons-round text-lg">warning</span>
                                            </div>
                                            Missing Requirements
                                        </h2>
                                        <span className={`${styles.tag} ${styles.tagRed} shadow-sm`}>High Priority</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {result.match_result?.skill_gaps?.map((gap: string, idx: number) => (
                                            <Tag key={idx} text={gap} />
                                        ))}
                                        {(!result.match_result?.skill_gaps || result.match_result.skill_gaps.length === 0) && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No significant skill gaps found.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Combined Improvements Container */}
                                <div className={styles.sectionImprovements}>
                                    {/* Resume Suggestions */}
                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center">
                                                    <span className="material-icons-round text-lg">lightbulb</span>
                                                </div>
                                                Resume Suggestions
                                            </h2>
                                            <span className="bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Content</span>
                                        </div>
                                        <div className="space-y-3">
                                            {displayedSuggestions.map((suggestion: string, idx: number) => (
                                                <div key={idx} className={styles.itemCard}>
                                                    <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 text-green-500">
                                                        <span className="material-icons-round">edit_note</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{suggestion}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {suggestions.length === 0 && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No content suggestions.</p>
                                            )}
                                            {suggestions.length > 3 && (
                                                <button 
                                                    onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                                                    className="w-full py-2 mt-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    {showAllSuggestions ? "Show Less" : `View All (${suggestions.length})`}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Structural Improvements */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                    <span className="material-icons-round text-lg">build</span>
                                                </div>
                                                ATS & Structural Improvements
                                            </h2>
                                            <span className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Formatting</span>
                                        </div>
                                        <div className="space-y-3">
                                            {displayedIssues.map((issue: string, idx: number) => (
                                                <div key={idx} className={styles.itemCard}>
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-blue-500">
                                                        <span className="material-icons-round">error_outline</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{issue}</h3>
                                                        {result.ats_result?.suggestions?.[idx] && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{result.ats_result.suggestions[idx]}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {atsIssues.length === 0 && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No significant structural issues found.</p>
                                            )}
                                            {atsIssues.length > 3 && (
                                                <button 
                                                    onClick={() => setShowAllATS(!showAllATS)}
                                                    className="w-full py-2 mt-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    {showAllATS ? "Show Less" : `View All (${atsIssues.length})`}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function ResultPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <Suspense fallback={<ResultSkeleton />}>
                <ResultContent />
            </Suspense>
        </div>
    );
}
