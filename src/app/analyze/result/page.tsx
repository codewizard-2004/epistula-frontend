"use client";

import styles from "./result.module.css";
import Navbar from "@/components/Navbar";
import ATSScoreCircle from "@/components/ATSScoreCircle";
import MatchScoreCard from "@/components/MatchScoreCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResultContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

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
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review your resume performance for "Senior Product Designer"</p>
                    </div>
                </header>

                <main className={styles.main}>
                    <div className={styles.scrollArea}>
                        <div className={styles.grid}>
                            <div className={styles.sidebar}>
                                <ATSScoreCircle
                                    score={82}
                                    label="Excellent"
                                    description="Your resume parses well on most Applicant Tracking Systems."
                                />

                                <MatchScoreCard
                                    score={65}
                                    targetRole="Senior Product Designer"
                                    company="Company"
                                    tags={["Missing Keywords: 4", "Experience gap"]}
                                />

                                <div className="grid grid-cols-1 gap-3 mt-auto">
                                    <Link href={`/analyze/generation?id=gen-${Math.random().toString(36).substring(2, 11)}&type=letter`} className={styles.buttonPrimary}>
                                        <span className="material-icons-round">description</span>
                                        Create Cover Letter
                                    </Link>
                                    <Link href={`/analyze/generation?id=gen-${Math.random().toString(36).substring(2, 11)}&type=email`} className={styles.buttonSecondary}>
                                        <span className="material-icons-round">mail</span>
                                        Create Cover Email
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
                                    <div className="space-y-3">
                                        {[
                                            { title: "User Research Methodology", desc: "The job description emphasizes \"qualitative user research\". Consider adding specific methodologies used (e.g., diary studies, interviews)." },
                                            { title: "Figma Prototyping", desc: "\"Advanced prototyping\" is listed as a must-have. Your resume mentions Figma but lacks depth on prototyping complexity." },
                                            { title: "Agile/Scrum Experience", desc: "Explicit mention of working within Agile sprints is missing." }
                                        ].map((item, idx) => (
                                            <div key={idx} className={styles.itemCard}>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                                                </div>
                                                <button className="text-gray-400 hover:text-black dark:hover:text-white"><span className="material-icons-round">edit</span></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Structural Improvements */}
                                <div className={styles.sectionImprovements}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                <span className="material-icons-round text-lg">build</span>
                                            </div>
                                            Structural Improvements
                                        </h2>
                                        <span className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Medium Priority</span>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { title: "Bullet Point Length", desc: "Some bullet points under \"Experience\" are too long (over 2 lines). Condense for better readability.", icon: "format_list_bulleted" },
                                            { title: "Section Headers", desc: "Standardize section headers. You use \"Work History\" and \"Experience\" interchangeably.", icon: "title" }
                                        ].map((item, idx) => (
                                            <div key={idx} className={styles.itemCard}>
                                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-blue-500">
                                                    <span className="material-icons-round">{item.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                                                </div>
                                                <button className="text-sm text-blue-600 font-medium hover:underline">Fix</button>
                                            </div>
                                        ))}
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
            <Suspense fallback={<div className="flex-1 flex items-center justify-center dark:text-white">Loading analysis...</div>}>
                <ResultContent />
            </Suspense>
        </div>
    );
}
