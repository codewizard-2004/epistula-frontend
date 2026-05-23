import React from 'react';

export default function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-4 w-full h-full p-1">
            <div className="space-y-2 mb-6">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mt-2"></div>
            </div>
            <div className="space-y-3">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
            </div>
            <div className="space-y-3 pt-4">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
        </div>
    );
}
