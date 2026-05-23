"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Navbar from "@/components/Navbar";
import styles from "./generation.module.css";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useParser } from "@/hooks/useParser";

function GenerationContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<"cover-letter" | "cover-email">("cover-letter");
    const [tone, setTone] = useState<"professional" | "casual" | "confident">("professional");
    const [drafts, setDrafts] = useState({ "cover-letter": "", "cover-email": "" });
    const [isGenerated, setIsGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [fullData, setFullData] = useState<any>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [originalFilename, setOriginalFilename] = useState("");
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [isResizing, setIsResizing] = useState(false);
    const [isEditingJob, setIsEditingJob] = useState(!searchParams.get("id"));
    const [tempJobTitle, setTempJobTitle] = useState("");
    const [tempCompanyName, setTempCompanyName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { parse, isParsing } = useParser();
    const hasId = !!searchParams.get("id");

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
            setAnalysisData({ job: { jobTitle: "", companyName: "", location: "" } });
            setJobDescription("");
            setOriginalFilename("");
            setDrafts({ "cover-letter": "", "cover-email": "" });
            return;
        }

        if (type === "email") {
            setActiveTab("cover-email");
        } else if (type === "letter") {
            setActiveTab("cover-letter");
        }

        const fetchFromDb = async (resultId: string) => {
            try {
                const { data, error } = await supabase
                    .from('ANALYSIS_RESULT')
                    .select(`
                        *,
                        ANALYSIS_JOB (
                            parsed_job_desc,
                            job_desc,
                            resume_file,
                            parsed_resume,
                            generation_name
                        )
                    `)
                    .eq('result_id', resultId)
                    .single();

                if (error) throw error;

                if (data && data.ANALYSIS_JOB) {
                    const jobDetails = data.ANALYSIS_JOB;
                    setAnalysisData({
                        job: {
                            jobTitle: jobDetails.parsed_job_desc?.title || "Target Role",
                            companyName: jobDetails.parsed_job_desc?.company || "Company",
                            location: jobDetails.parsed_job_desc?.location || "Location",
                        }
                    });
                    setJobDescription(jobDetails.job_desc || "");
                    
                    setFullData({
                        parsed_jd: jobDetails.parsed_job_desc,
                        parsed_resume: jobDetails.parsed_resume,
                        match_result: data.match_result,
                        generation_name: jobDetails.generation_name
                    });

                    if (jobDetails.resume_file) {
                        const parts = jobDetails.resume_file.split('/');
                        setOriginalFilename(parts[parts.length - 1]);
                    }
                    return true;
                }
            } catch (err) {
                console.error("Failed to fetch from DB", err);
            }
            return false;
        };

        const loadFallback = () => {
            const storedData = localStorage.getItem("epistula_analysis_data");
            const storedJob = localStorage.getItem("epistula_job_description");
            const storedFilename = localStorage.getItem("epistula_resume_filename");

            if (storedData) {
                const pData = JSON.parse(storedData);
                setAnalysisData({
                    job: {
                        jobTitle: pData.parsed_jd?.title || "Target Role",
                        companyName: pData.parsed_jd?.company || "Company",
                        location: pData.parsed_jd?.location || "Location",
                    }
                });
            } else {
                setAnalysisData({
                    job: { jobTitle: "Senior Frontend Developer", companyName: "TechCorp Inc.", location: "Remote" }
                });
            }

            if (storedJob) setJobDescription(storedJob);
            else setJobDescription("We are looking for an experienced Frontend Developer... 5+ years of experience with React and Tailwind CSS... UI/UX principles.");

            if (storedFilename) setOriginalFilename(storedFilename);
        };

        if (id) {
            fetchFromDb(id).then(success => {
                if (!success) loadFallback();
            });
        } else {
            loadFallback();
        }
    }, [searchParams]);

    const handleGenerate = async () => {
        if (!fullData && !hasId) {
            if (!resumeFile || !jobDescription) {
                alert("Please provide both a resume file and a job description.");
                return;
            }
        }

        setIsGenerating(true);
        try {
            let dataForGen = fullData;

            if (!dataForGen) {
                const parseResult = await parse(resumeFile!, jobDescription);
                if (!parseResult) throw new Error("Failed to parse document");

                dataForGen = {
                    parsed_jd: parseResult.parsed_jd,
                    parsed_resume: parseResult.parsed_resume,
                    match_result: { score: 100, matched_skills: [], skill_gaps: [], suggestions: [] },
                    generation_name: `${parseResult.parsed_jd?.title || "Job"} at ${parseResult.parsed_jd?.company || "Company"}`
                };
                setFullData(dataForGen);

                setAnalysisData({
                    job: {
                        jobTitle: parseResult.parsed_jd?.title || "Target Role",
                        companyName: parseResult.parsed_jd?.company || "Company",
                        location: parseResult.parsed_jd?.location || "Location",
                    }
                });
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/generate/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    parsed_jd: dataForGen.parsed_jd,
                    parsed_resume: dataForGen.parsed_resume,
                    matching_analysis: dataForGen.match_result,
                    tone: tone,
                    generate_email: true
                })
            });

            if (!response.ok) throw new Error("Generation failed");

            const result = await response.json();

            setDrafts({
                "cover-letter": result.cover_letter || "",
                "cover-email": result.cover_email || ""
            });
            setIsGenerated(true);
            setSaveSuccess(false);

        } catch (err) {
            console.error("Generation error", err);
            alert("An error occurred during generation.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Please log in to save drafts.");
                return;
            }

            const { error } = await supabase.from('GENERATION_RESULT').insert({
                user_id: user.id,
                name: fullData?.generation_name || "New Draft",
                cover_letter: drafts["cover-letter"],
                cover_email: drafts["cover-email"]
            });

            if (error) throw error;
            setSaveSuccess(true);
        } catch (error) {
            console.error("Save error", error);
            alert("Failed to save drafts.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopy = async () => {
        if (!drafts[activeTab]) return;
        try {
            await navigator.clipboard.writeText(drafts[activeTab]);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
            console.error("Failed to copy", err);
            alert("Failed to copy to clipboard.");
        }
    };

    const handleDownloadPdf = async () => {
        if (!drafts[activeTab]) return;
        try {
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF();
            
            const text = drafts[activeTab];
            const lines = doc.splitTextToSize(text, 180);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            
            let y = 20;
            const lineHeight = 6;
            
            lines.forEach((line: string) => {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, 15, y);
                y += lineHeight;
            });
            
            const companyName = analysisData?.job?.companyName || "Company";
            const filename = `${activeTab === "cover-letter" ? "Cover_Letter" : "Cover_Email"}_${companyName}.pdf`.replace(/[^a-zA-Z0-9]/g, "_");
            doc.save(filename);
        } catch (err) {
            console.error("Failed to generate PDF", err);
            alert("Failed to generate PDF.");
        }
    };

    useEffect(() => {
        // Active tab relies on drafts state, no additional fetch needed when switching
    }, [activeTab]);

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
                                {!hasId && (
                                    <button
                                        className={`p-1.5 rounded-full transition ${isEditingJob ? "bg-primary text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"}`}
                                        onClick={() => {
                                            if (!isEditingJob) {
                                                setTempJobTitle(analysisData?.job?.jobTitle || "");
                                                setTempCompanyName(analysisData?.job?.companyName || "");
                                            } else {
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
                                )}
                            </div>
                            <div className={styles.jobContent}>
                                {!analysisData ? (
                                    <LoadingSkeleton />
                                ) : isEditingJob ? (
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
                            <div className={`${styles.resumePreview} ${!hasId ? 'group cursor-pointer' : ''}`} onClick={!hasId ? triggerResumeUpload : undefined}>
                                <div className={`absolute inset-0 p-6 ${!hasId ? 'opacity-40 blur-[1px] group-hover:blur-0 transition-all duration-300' : 'opacity-100 blur-none'}`}>
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
                                {!hasId && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 backdrop-blur-[1px]">
                                        <span className="text-xs font-bold text-primary dark:text-white bg-white/90 dark:bg-slate-800/90 px-4 py-2 rounded-lg shadow-md border border-white/20">Upload New Resume</span>
                                    </div>
                                )}
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
                                    
                                    {saveSuccess ? (
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center gap-1">
                                            <span className="material-icons-round text-[10px]">check_circle</span>
                                            Saved
                                        </span>
                                    ) : isGenerated ? (
                                        <button 
                                            className="p-1.5 bg-slate-900 dark:bg-black hover:bg-slate-800 text-white rounded-full transition shadow-sm disabled:opacity-50 flex items-center justify-center"
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            title="Save to Database"
                                        >
                                            <span className={`material-icons-round text-sm ${isSaving ? 'animate-spin' : ''}`}>
                                                {isSaving ? 'sync' : 'save'}
                                            </span>
                                        </button>
                                    ) : null}
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
                                    <button 
                                        className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition border border-slate-200/50 dark:border-slate-700" 
                                        title="Copy"
                                        onClick={handleCopy}
                                        disabled={!isGenerated}
                                    >
                                        <span className="material-icons-round text-sm">content_copy</span>
                                    </button>
                                    <button 
                                        className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition border border-slate-200/50 dark:border-slate-700" 
                                        title="Download PDF"
                                        onClick={handleDownloadPdf}
                                        disabled={!isGenerated}
                                    >
                                        <span className="material-icons-round text-sm">download</span>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.editorBody}>
                                {!isGenerated ? (
                                    <div className="flex-1 flex flex-col items-center justify-center h-full">
                                        <button 
                                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            onClick={handleGenerate}
                                            disabled={isGenerating || isParsing || (hasId ? !analysisData : (!resumeFile || !jobDescription))}
                                        >
                                            <span className={`material-icons-round ${isGenerating || isParsing ? 'animate-spin' : ''}`}>
                                                {isGenerating || isParsing ? 'refresh' : 'auto_awesome'}
                                            </span>
                                            {isGenerating || isParsing ? 'Generating...' : `Generate Drafts`}
                                        </button>
                                        <p className="text-slate-400 mt-4 text-sm max-w-sm text-center">Click generate to draft a personalized response using your resume and the provided job description.</p>
                                    </div>
                                ) : (
                                    <>
                                        <textarea
                                            className={styles.textarea + " custom-scrollbar"}
                                            value={drafts[activeTab]}
                                            onChange={(e) => setDrafts(prev => ({ ...prev, [activeTab]: e.target.value }))}
                                            spellCheck="false"
                                        />

                                        <button className={styles.regenerateBtn} onClick={handleGenerate} disabled={isGenerating}>
                                            <span className={`material-icons-round text-sm ${isGenerating ? 'animate-spin' : ''}`}>
                                                {isGenerating ? 'refresh' : 'auto_fix_high'}
                                            </span>
                                            <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
                                        </button>
                                    </>
                                )}
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

            {/* Toast Notification */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="bg-slate-900 dark:bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-slate-700/50">
                    <span className="material-icons-round text-green-400 text-sm">check_circle</span>
                    <span className="text-xs font-bold tracking-wide">Copied to clipboard</span>
                </div>
            </div>
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
