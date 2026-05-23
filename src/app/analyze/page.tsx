"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./analyze.module.css";
import Navbar from "@/components/Navbar";
import LoadingModal from "@/components/LoadingModal";
import { useParser } from "@/hooks/useParser";
import { useAnalyze } from "@/hooks/useAnalyze";
import { supabase } from "@/lib/supabase";

export default function AnalyzePage() {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<any>(null);
    const [showResults, setShowResults] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [jobDescription, setJobDescription] = useState("");
    const insertedJobIdRef = useRef<string | null>(null);

    const { parse, isParsing: isParsingHook } = useParser();
    const { analyze } = useAnalyze();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !jobDescription) {
            alert("Please provide both a resume file and a job description.");
            return;
        }

        const data = await parse(file, jobDescription);
        if (data) {
            setParsedData(data);
            setShowResults(true);
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            let resumeFilePath = "";
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;
                resumeFilePath = filePath;
            }

            const { data: insertData, error: insertError } = await supabase
                .from('ANALYSIS_JOB')
                .insert({
                    generation_name: `${parsedData.parsed_jd?.title || 'Job'} at ${parsedData.parsed_jd?.company || 'Company'}`,
                    user_id: user.id,
                    resume_file: resumeFilePath,
                    parsed_resume: parsedData.parsed_resume,
                    job_desc: jobDescription,
                    parsed_job_desc: parsedData.parsed_jd,
                })
                .select()
                .single();

            if (insertError) throw insertError;

            // Call analyze API
            const analyzeResult = await analyze(parsedData.parsed_jd, parsedData.parsed_resume, parsedData.raw_resume);
            if (!analyzeResult) throw new Error("Analysis API failed");

            // Insert to ANALYSIS_RESULT
            const { data: resultData, error: resultError } = await supabase
                .from('ANALYSIS_RESULT')
                .insert({
                    job_id: insertData.id,
                    match_result: analyzeResult.match_analysis,
                    ats_result: analyzeResult.ats_result
                })
                .select()
                .single();

            if (resultError) throw resultError;

            // Persist for other pages
            localStorage.setItem("epistula_analysis_data", JSON.stringify(parsedData));
            localStorage.setItem("epistula_job_description", jobDescription);
            if (file) {
                localStorage.setItem("epistula_resume_filename", file.name);
            }

            insertedJobIdRef.current = resultData.result_id;
            
            // Route explicitly when the API and DB operations are complete
            router.push(`/analyze/result?id=${resultData.result_id}`);

        } catch (error) {
            console.error("Analysis failed:", error);
            setIsAnalyzing(false);
        }
    };

    const handleAnalysisComplete = useCallback(() => {
        // Do nothing here to avoid race conditions. 
        // The router push is handled inside handleAnalyze when the API finishes.
    }, []);

    const analysisSteps = [
        { title: "Document Uploaded", description: "Source file successfully parsed and validated." },
        { title: "ATS Compatibility Check", description: "Evaluating your resume against common tracking algorithms." },
        { title: "Skill Gap Analysis", description: "Identifying missing keywords and relevant industry skills." },
        { title: "Formatting Review", description: "Checking layout consistency and visual hierarchy." }
    ];

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (category: 'parsed_resume' | 'parsed_jd', field: string, value: string) => {
        setParsedData((prev: any) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    return (
        <div className="font-body min-h-screen transition-colors duration-300 overflow-x-clip relative pb-12">
            <Navbar />

            <LoadingModal
                isOpen={isAnalyzing}
                onComplete={handleAnalysisComplete}
                steps={analysisSteps}
            />

            {/* Background Effects */}
            <div className={styles.bgGradient}></div>
            <div className={styles.blobTop}></div>
            <div className={styles.blobBottom}></div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                {/* Positive Text Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                        Let's get you noticed! 🚀
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Your dream career is just an analysis away. Upload your resume and tell us about the job you're targeting.
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-8 items-stretch min-h-[500px]">
                    {/* Job Description Section */}
                    <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-icons-round text-accent-purple">description</span>
                                Job Description
                            </h2>
                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Paste the text below</span>
                        </div>
                        <div className={`${styles.textareaContainer} flex-grow`}>
                            <textarea
                                className="w-full h-full min-h-[400px] p-4 bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 resize-none placeholder-gray-400 dark:placeholder-gray-600 outline-none"
                                placeholder="Paste the full job description here. Include requirements, responsibilities, and company details for the best analysis results..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-icons-round text-accent-purple">cloud_upload</span>
                                Upload Resume
                            </h2>
                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">PDF or DOCX</span>
                        </div>

                        <div
                            className={`${styles.uploadContainer} flex-grow group cursor-pointer h-full`}
                            onClick={triggerFileInput}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.docx"
                                onChange={handleFileChange}
                            />
                            <div className={`${styles.glassPanel} h-full p-8 flex flex-col`}>
                                <div className={`${styles.dashedBorder} flex-grow`}>
                                    {file ? (
                                        <div className="text-center animate-in fade-in zoom-in duration-300">
                                            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-6 shadow-soft">
                                                <span className="material-icons-round text-5xl">task_alt</span>
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">File ready for analysis</p>
                                            <button className="mt-4 text-accent-purple text-xs font-bold hover:underline">Change File</button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`${styles.uploadIcon} w-20 h-20 rounded-full bg-accent-purple/10 flex items-center justify-center text-accent-purple mb-6`}>
                                                <span className="material-icons-round text-5xl">upload_file</span>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-xl font-semibold mb-2">Drag & drop your resume</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">or click to browse from your computer</p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-6">
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 border border-gray-100 dark:border-gray-700">
                                                    <span className="material-icons-round text-sm">picture_as_pdf</span>
                                                    PDF
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 border border-gray-100 dark:border-gray-700">
                                                    <span className="material-icons-round text-sm">description</span>
                                                    DOCX
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Extraction Results */}
                {showResults && (
                    <div className="mt-12 animate-in slide-in-from-bottom-8 fade-in duration-700">
                        <div className="mb-8 flex items-center gap-2 px-2">
                            <span className="material-icons-round text-green-500">auto_awesome</span>
                            <h3 className="text-xl font-bold">We found these key elements:</h3>
                        </div>

                        <div className={styles.categorySection}>
                            {/* From Resume Card */}
                            <div className={styles.categoryCard}>
                                <div className={styles.categoryHeader}>
                                    <div className={`${styles.categoryIcon} bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400`}>
                                        <span className="material-icons-round">person</span>
                                    </div>
                                    <span className={styles.categoryTitle}>From Resume</span>
                                </div>

                                <div className="space-y-6">
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Full Name</label>
                                        <input
                                            type="text"
                                            className={styles.editableInput}
                                            value={parsedData?.parsed_resume?.name || ''}
                                            onChange={(e) => handleInputChange('parsed_resume', 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Email</label>
                                        <input
                                            type="email"
                                            className={styles.editableInput}
                                            value={parsedData?.parsed_resume?.email || ''}
                                            onChange={(e) => handleInputChange('parsed_resume', 'email', e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Location / Phone</label>
                                        <input
                                            type="text"
                                            className={styles.editableInput}
                                            value={parsedData?.parsed_resume?.location || parsedData?.parsed_resume?.phone || ''}
                                            onChange={(e) => handleInputChange('parsed_resume', 'location', e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Years of Experience</label>
                                        <input
                                            type="text"
                                            className={styles.editableInput}
                                            value={parsedData?.parsed_resume?.experience || ''}
                                            onChange={(e) => handleInputChange('parsed_resume', 'experience', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* From Job Description Card */}
                            <div className={styles.categoryCard}>
                                <div className={styles.categoryHeader}>
                                    <div className={`${styles.categoryIcon} bg-orange-100/50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400`}>
                                        <span className="material-icons-round">business_center</span>
                                    </div>
                                    <span className={styles.categoryTitle}>From Job Description</span>
                                </div>

                                <div className="space-y-6">
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Company Name</label>
                                        <input
                                            type="text"
                                            className={styles.editableInput}
                                            value={parsedData?.parsed_jd?.company || ''}
                                            onChange={(e) => handleInputChange('parsed_jd', 'company', e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Job Title</label>
                                        <input
                                            type="text"
                                            className={styles.editableInput}
                                            value={parsedData?.parsed_jd?.title || ''}
                                            onChange={(e) => handleInputChange('parsed_jd', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Location</label>
                                        <input
                                            type="text"
                                            className={styles.editableInput}
                                            value={parsedData?.parsed_jd?.location || ''}
                                            onChange={(e) => handleInputChange('parsed_jd', 'location', e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Employment Type</label>
                                        <input
                                            type="text"
                                            className={styles.editableInput}
                                            value={parsedData?.parsed_jd?.employment_type || ''}
                                            onChange={(e) => handleInputChange('parsed_jd', 'employment_type', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center items-center py-12">
                    {!showResults ? (
                        <button
                            className={`${styles.analyzeButton} ${(!file || !jobDescription) ? 'opacity-50 cursor-not-allowed shadow-none' : ''}`}
                            disabled={!file || !jobDescription || isParsingHook}
                            onClick={handleUpload}
                        >
                            {isParsingHook ? (
                                <>
                                    <span className="material-icons-round animate-spin">refresh</span>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons-round text-2xl">cloud_upload</span>
                                    Upload Resume
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            className={styles.analyzeButton}
                            onClick={handleAnalyze}
                        >
                            <span className="material-icons-round text-2xl group-hover:animate-pulse">analytics</span>
                            Analyze Resume
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
