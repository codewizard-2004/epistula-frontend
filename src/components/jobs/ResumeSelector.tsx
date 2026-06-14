import React, { useState, useRef, useEffect } from 'react';
import { useResume } from '@/hooks/useResume';

export default function ResumeSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { savedResumes, activeResume, setActiveResume, isLoading, error, fetchSavedResumes, uploadNewResume } = useResume();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Fetch on mount to check if we have saved resumes
        fetchSavedResumes();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUploadNew = () => {
        fileInputRef.current?.click();
        setIsOpen(false);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await uploadNewResume(e.target.files[0]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleUseSaved = (resume: any) => {
        setActiveResume(resume);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mr-2"
                title={activeResume ? `Active: ${activeResume.resume_file}` : "No resume selected"}
            >
                {isLoading ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                ) : (
                    <span className={`material-symbols-outlined text-[18px] ${activeResume ? 'text-green-500' : ''}`}>
                        {activeResume ? 'task_alt' : 'upload_file'}
                    </span>
                )}
                <span className="hidden sm:inline max-w-[150px] truncate">
                    {isLoading ? 'Processing...' : activeResume ? activeResume.resume_file : 'Add Resume'}
                </span>
            </button>
            {error && (
                <div className="absolute top-full mt-1 left-0 text-xs text-red-500 whitespace-nowrap bg-white dark:bg-gray-800 p-1 rounded shadow z-50">
                    {error}
                </div>
            )}

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-[60]">
                    <div className="p-2 space-y-1">
                        <button
                            onClick={handleUploadNew}
                            className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-3 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px] text-indigo-500">cloud_upload</span>
                            Upload New Resume
                        </button>
                        {savedResumes && savedResumes.length > 0 && (
                            <div className="pt-2">
                                <div className="px-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Saved Resumes
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {savedResumes.map((resume, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleUseSaved(resume)}
                                            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                                                activeResume?.created_at === resume.created_at
                                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <div className="flex flex-col truncate pr-2">
                                                <span className="truncate max-w-[140px]">{resume.resume_file}</span>
                                                <span className="text-[10px] opacity-70">
                                                    {new Date(resume.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {activeResume?.created_at === resume.created_at && (
                                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept=".pdf,.docx"
                onChange={handleFileChange}
            />
        </div>
    );
}
