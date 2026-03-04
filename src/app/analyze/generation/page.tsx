"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Navbar from "@/components/Navbar";
import styles from "./generation.module.css";
import { useSearchParams } from "next/navigation";

function GenerationContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<"cover-letter" | "cover-email">("cover-letter");
    const [tone, setTone] = useState<"professional" | "casual" | "confident">("professional");
    const [draft, setDraft] = useState("");
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [originalFilename, setOriginalFilename] = useState("");
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [isResizing, setIsResizing] = useState(false);
    const [isEditingJob, setIsEditingJob] = useState(false);
    const [tempJobTitle, setTempJobTitle] = useState("");
    const [tempCompanyName, setTempCompanyName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            // Limit sidebar width between 250px and 600px
            const newWidth = Math.max(250, Math.min(600, e.clientX - 24)); // Adjust for container padding
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const triggerResumeUpload = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        const type = searchParams.get("type");
        const id = searchParams.get("id");
        const source = searchParams.get("source");

        if (source === "direct") {
            setAnalysisData({
                job: {
                    jobTitle: "",
                    companyName: "",
                    location: "",
                }
            });
            setJobDescription("");
            setOriginalFilename("");
            setDraft("");
        }

        if (type === "email") {
            setActiveTab("cover-email");
        } else if (type === "letter") {
            setActiveTab("cover-letter");
        }
    }, [searchParams]);

    useEffect(() => {
        // Load data from localStorage
        const storedData = localStorage.getItem("epistula_analysis_data");
        const storedJob = localStorage.getItem("epistula_job_description");
        const storedFilename = localStorage.getItem("epistula_resume_filename");

        if (storedData) {
            setAnalysisData(JSON.parse(storedData));
        } else {
            // Fallback mock data if none found
            setAnalysisData({
                job: {
                    jobTitle: "Senior Frontend Developer",
                    companyName: "TechCorp Inc.",
                    location: "Remote",
                }
            });
        }

        if (storedJob) {
            setJobDescription(storedJob);
        } else {
            setJobDescription("We are looking for an experienced Frontend Developer... 5+ years of experience with React and Tailwind CSS... UI/UX principles.");
        }

        if (storedFilename) {
            setOriginalFilename(storedFilename);
        }
    }, []);

    const coverLetterTemplate = `Dear Hiring Manager,

I am writing to express my strong interest in the ${analysisData?.job?.jobTitle || 'Job Title'} position at ${analysisData?.job?.companyName || 'Company Name'}. With my specialized experience in React and modern CSS frameworks like Tailwind, I was excited to see an opening that aligns so perfectly with my background.

In my previous roles, I have consistently delivered high-quality frontend solutions. I noticed ${analysisData?.job?.companyName || 'TechCorp'} values performance optimization, and I believe my expertise in this area could provide immediate value to your engineering team.

I have attached my resume for your review and look forward to the possibility of discussing how I can contribute to your team's success.

Sincerely,
Alex Dev`;

    const coverEmailTemplate = `Subject: Application for ${analysisData?.job?.jobTitle || 'Job Title'} - Alex Dev

Hi Team,

I'm Alex, and I'm excited to apply for the ${analysisData?.job?.jobTitle || 'Job Title'} role at ${analysisData?.job?.companyName || 'Company Name'}. 

Having spent years building high-performance React applications, I'm confident I can help your team push the boundaries of your frontend experience. I've always admired your commitment to clean UI and performance.

Attached is my resume. I'd love to chat more about how my background fits your current needs.

Best,
Alex Dev`;

    useEffect(() => {
        if (analysisData) {
            setDraft(activeTab === "cover-letter" ? coverLetterTemplate : coverEmailTemplate);
        }
    }, [activeTab, analysisData]);

    return (
        <div className="font-body h-screen transition-colors duration-300 overflow-hidden relative flex flex-col">
            <Navbar />

            {/* Background Effects */}
            <div className={styles.bgGradient}></div>
            <div className={styles.blob + " " + styles.blob1}></div>
            <div className={styles.blob + " " + styles.blob2}></div>
            <div className={styles.blob + " " + styles.blob3}></div>

            <main className={styles.container} style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}>
                <div className={styles.layout}>
                    {/* Left Sidebar */}
                    <aside className={styles.sidebar}>
                        <div className={styles.glassPanel + " " + styles.sidebarCard}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>
                                    <span className="material-icons-round text-blue-500 text-lg">work</span>
                                    Job Description
                                </h2>
                                <button
                                    className={`p-1.5 rounded-full transition ${isEditingJob ? "bg-primary text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"}`}
                                    onClick={() => {
                                        if (!isEditingJob) {
                                            setTempJobTitle(analysisData?.job?.jobTitle || "");
                                            setTempCompanyName(analysisData?.job?.companyName || "");
                                        } else {
                                            // Save changes
                                            setAnalysisData((prev: any) => ({
                                                ...prev,
                                                job: {
                                                    ...prev?.job,
                                                    jobTitle: tempJobTitle,
                                                    companyName: tempCompanyName
                                                }
                                            }));
                                        }
                                        setIsEditingJob(!isEditingJob);
                                    }}
                                >
                                    <span className="material-icons-round text-xs">{isEditingJob ? "check" : "edit"}</span>
                                </button>
                            </div>
                            <div className={styles.jobContent}>
                                {isEditingJob ? (
                                    <div className="space-y-3 mb-3">
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-xs font-bold text-primary dark:text-white focus:ring-1 focus:ring-primary"
                                            placeholder="Job Title"
                                            value={tempJobTitle}
                                            onChange={(e) => setTempJobTitle(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-xs font-medium text-slate-500 focus:ring-1 focus:ring-primary"
                                            placeholder="Company Name"
                                            value={tempCompanyName}
                                            onChange={(e) => setTempCompanyName(e.target.value)}
                                        />
                                        <textarea
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 focus:ring-1 focus:ring-primary min-h-[150px] resize-none custom-scrollbar"
                                            placeholder="Paste job description here..."
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-3">
                                            <p className="font-bold text-primary dark:text-white text-sm mb-0.5">{analysisData?.job?.jobTitle || "Job Title"}</p>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{analysisData?.job?.companyName || "Company"} • {analysisData?.job?.location || "Location"}</p>
                                        </div>
                                        <div className="flex-1 overflow-y-auto text-xs leading-relaxed text-slate-600 dark:text-slate-400 custom-scrollbar pr-1">
                                            {jobDescription || "No description provided."}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={styles.glassPanel + " " + styles.sidebarCard}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>
                                    <span className="material-icons-round text-purple-500 text-lg">description</span>
                                    Resume Source
                                </h2>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleResumeChange}
                                        className="hidden"
                                        accept=".pdf,.docx"
                                    />
                                    <span className="text-[10px] font-medium px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                                        {resumeFile ? resumeFile.name : "PDF Loaded"}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.resumePreview + " group"} onClick={triggerResumeUpload}>
                                <div className="absolute inset-0 p-6 opacity-40 blur-[1px] group-hover:blur-0 transition-all duration-300">
                                    <div className="w-1/2 h-4 bg-slate-400 dark:bg-slate-500 rounded mb-6"></div>
                                    <p className="text-[10px] font-bold text-slate-500 mb-2 truncate">
                                        {resumeFile ? resumeFile.name : (originalFilename || "alex_chen_resume.pdf")}
                                    </p>
                                    <div className="space-y-3">
                                        <div className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded"></div>
                                        <div className="w-5/6 h-2 bg-slate-300 dark:bg-slate-600 rounded"></div>
                                        <div className="w-4/6 h-2 bg-slate-300 dark:bg-slate-600 rounded"></div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 backdrop-blur-[1px]">
                                    <span className="text-xs font-bold text-primary dark:text-white bg-white/90 dark:bg-slate-800/90 px-4 py-2 rounded-lg shadow-md border border-white/20">Upload New Resume</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Resize Handle */}
                    <div
                        className={`${styles.resizeHandle} ${isResizing ? styles.resizeHandleActive : ""}`}
                        onMouseDown={handleMouseDown}
                    />

                    {/* Main Section */}
                    <main className={styles.mainContent}>
                        <div className={styles.glassPanel + " " + styles.editorContainer}>
                            <div className={styles.editorHeader}>
                                <div className="flex items-center gap-3">
                                    <span className="material-icons-round text-yellow-500">auto_awesome</span>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Generated Draft</h2>
                                    {searchParams.get("id") && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center gap-1">
                                            <span className="material-icons-round text-[10px]">history</span>
                                            Saved
                                        </span>
                                    )}
                                </div>

                                <div className={styles.tabs}>
                                    <button
                                        className={`${styles.tab} ${activeTab === "cover-letter" ? styles.tabActive : ""}`}
                                        onClick={() => setActiveTab("cover-letter")}
                                    >
                                        Cover Letter
                                    </button>
                                    <button
                                        className={`${styles.tab} ${activeTab === "cover-email" ? styles.tabActive : ""}`}
                                        onClick={() => setActiveTab("cover-email")}
                                    >
                                        Cover Email
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition border border-slate-200/50 dark:border-slate-700" title="Copy">
                                        <span className="material-icons-round text-sm">content_copy</span>
                                    </button>
                                    <button className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition border border-slate-200/50 dark:border-slate-700" title="Download">
                                        <span className="material-icons-round text-sm">download</span>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.editorBody}>
                                <textarea
                                    className={styles.textarea + " custom-scrollbar"}
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    spellCheck="false"
                                />

                                <button className={styles.regenerateBtn}>
                                    <span className="material-icons-round text-sm">auto_fix_high</span>
                                    <span>Regenerate</span>
                                </button>
                            </div>

                            <div className={styles.footerActions}>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mr-2">Tone:</span>
                                    <div className="flex items-center gap-2 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl">
                                        {(["professional", "casual", "confident"] as const).map((t) => (
                                            <button
                                                key={t}
                                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition capitalize ${tone === t
                                                    ? "bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white"
                                                    : "text-slate-500 hover:bg-white/40 dark:hover:bg-slate-700/40"
                                                    }`}
                                                onClick={() => setTone(t)}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </main>
        </div>
    );
}

export default function GenerationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <GenerationContent />
        </Suspense>
    );
}
