import React from 'react';
import { Job } from '@/hooks/useJobs';

interface JobCardProps {
    job: Job;
    onClick: (job: Job) => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
    return (
        <div 
            onClick={() => onClick(job)}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-600">
                    {job.employer_logo ? (
                        <img 
                            src={job.employer_logo} 
                            alt={`${job.employer_name} logo`} 
                            className="w-full h-full object-contain p-2"
                        />
                    ) : (
                        <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                            {job.employer_name?.charAt(0) || '?'}
                        </span>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {job.job_title}
                    </h3>
                    <p className="text-md text-gray-600 dark:text-gray-300 font-medium mt-1">
                        {job.employer_name}
                    </p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                        {(job.job_city || job.job_country || job.job_is_remote) && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                {job.job_is_remote ? 'Remote' : `${job.job_city || ''}${job.job_city && job.job_country ? ', ' : ''}${job.job_country || ''}`}
                            </span>
                        )}
                        {job.job_employment_type && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                <span className="material-symbols-outlined text-[14px]">work</span>
                                {job.job_employment_type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        )}
                    </div>
                </div>

                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        arrow_forward_ios
                    </span>
                </div>
            </div>
        </div>
    );
}
