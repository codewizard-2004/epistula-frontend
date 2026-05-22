"use client";

import { useState, useRef } from "react";
import styles from "./jobs.module.css";
import Navbar from "@/components/Navbar";
import LoadingModal from "@/components/LoadingModal";
import MatchScoreCard from "@/components/MatchScoreCard";

interface Job {
    id: string;
    company: string;
    title: string;
    location: string;
    salary: string;
    matchScore: number;
}

const MOCK_JOBS: Job[] = [
    {
        id: "1",
        company: "Stripe",
        title: "Senior Product Designer",
        location: "Remote (Global)",
        salary: "$160k - $220k",
        matchScore: 92
    },
    {
        id: "2",
        company: "Vercel",
        title: "Staff Frontend Engineer",
        location: "San Francisco, CA",
        salary: "$180k - $250k",
        matchScore: 88
    },
    {
        id: "3",
        company: "Figma",
        title: "Product Designer, Core Systems",
        location: "Remote (US)",
        salary: "$170k - $210k",
        matchScore: 85
    },
    {
        id: "4",
        company: "Linear",
        title: "Lead UI/UX Designer",
        location: "London, UK / Remote",
        salary: "£100k - £130k",
        matchScore: 79
    }
];

const QUOTES = [
    { text: "Choose a job you love, and you will never have to work a day in your life.", author: "Confucius" },
    { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs" },
    { text: "Opportunity is missed by most people because it is dressed in overalls and looks like work.", author: "Thomas Edison" }
];

export default function JobsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [results, setResults] = useState<Job[]>([]);
    const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSearch = () => {
        setIsSearching(true);
    };

    const handleSearchComplete = () => {
        setIsSearching(false);
        setResults(MOCK_JOBS);
        setHasSearched(true);
    };

    const searchSteps = [
        { title: "Analyzing Preferences", description: "Mapping your target roles and salary expectations." },
        { title: "Parsing Resume", description: "Extracting skills and experience from your uploaded file." },
        { title: "Scanning Platforms", description: "Searching LinkedIn, Indeed, and glassdoor for matches." },
        { title: "AI Matching", description: "Calculating compatibility scores for relevant openings." }
    ];

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <div className={styles.bgGradient}></div>

            <LoadingModal
                isOpen={isSearching}
                onComplete={handleSearchComplete}
                steps={searchSteps}
            />

            <main className={styles.contentWrapper}>
                {/* Section 1: Sidebar Controls */}
                <aside className={styles.sidebar}>
                    <div className={styles.glassPanel}>
                        <h2 className={styles.sidebarTitle}>
                            <span className="material-icons-round">search</span>
                            Job Search
                        </h2>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Your Resume</label>
                            <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,.docx"
                                />
                                <span className={`material-icons-round ${styles.uploadIcon}`}>
                                    {file ? "task_alt" : "cloud_upload"}
                                </span>
                                <p className="text-sm font-medium">
                                    {file ? file.name : "Upload your resume"}
                                </p>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Target Roles</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g. Product Designer"
                                defaultValue="Product Designer"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Location</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g. San Francisco or Remote"
                                defaultValue="Remote"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Min Salary (Annual)</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g. $100,000"
                                defaultValue="$150,000"
                            />
                        </div>

                        <button
                            className={`${styles.searchButton} ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleSearch}
                            disabled={!file || isSearching}
                        >
                            <span className="material-icons-round">auto_awesome</span>
                            Find Matches
                        </button>
                    </div>
                </aside>

                {/* Section 2: Active Search / Results */}
                <section className={styles.mainArea}>
                    {!hasSearched ? (
                        <div className={styles.idleState}>
                            <div className={styles.illustration}>
                                <span className="material-icons-round text-8xl text-indigo-400 opacity-60">
                                    rocket_launch
                                </span>
                            </div>
                            <h3 className={styles.quote}>"{quote.text}"</h3>
                            <p className={styles.author}>— {quote.author}</p>
                            <p className="mt-8 text-sm text-gray-400 max-w-sm">
                                Upload your resume and set your preferences on the left to discover AI-powered job matches.
                            </p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-between mb-8 px-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <span className="material-icons-round text-indigo-500">verified</span>
                                    {results.length} Top Matches Found
                                </h2>
                                <span className="text-sm text-gray-500 font-medium bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-gray-200/50 dark:border-gray-700/50">
                                    Sorted by compatibility
                                </span>
                            </div>

                            <div className={styles.resultsList}>
                                {results.map((job) => (
                                    <div key={job.id} className={styles.jobCard}>
                                        <div className={styles.jobInfo}>
                                            <span className={styles.companyName}>{job.company}</span>
                                            <h4 className={styles.jobTitle}>{job.title}</h4>
                                            <div className={styles.jobMeta}>
                                                <div className={styles.metaItem}>
                                                    <span className="material-icons-round text-sm">place</span>
                                                    {job.location}
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <span className="material-icons-round text-sm">payments</span>
                                                    {job.salary}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.matchBadge}>
                                            <span className={styles.matchLabel}>Match</span>
                                            <span>{job.matchScore}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
