"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface StatData {
    total_generation: number;
    saved_letters: number;
    job_searches: number;
    average_job_match: number;
    average_ats_score: number;
}

const CACHE_KEY = "epistula_user_stats";
const CACHE_EXPIRY = 5 * 60 * 1000;

export default function Statistics() {
    const [stats, setStats] = useState<StatData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const now = Date.now();
            const cachedData = sessionStorage.getItem(CACHE_KEY);

            if (cachedData) {
                try {
                    const { timestamp, data } = JSON.parse(cachedData);
                    if (now - timestamp < CACHE_EXPIRY) {
                        setStats(data);
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    console.warn("Cache parsing error, refetching...", e);
                }
            }

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from("STATISTICS")
                    .select("total_generation, saved_letters, job_searches, average_job_match, average_ats_score")
                    .eq("user_id", user.id)
                    .single();

                // If no row exists yet, handle gracefully (could be new user)
                const finalData = data || {
                    total_generation: 0,
                    saved_letters: 0,
                    job_searches: 0,
                    average_job_match: 0,
                    average_ats_score: 0
                };

                sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: now,
                    data: finalData
                }));

                setStats(finalData);
            } catch (err) {
                console.error("Failed to fetch statistics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-wrap gap-4 mt-6">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-[88px] w-48 bg-gray-100/50 dark:bg-gray-800/50 animate-pulse rounded-2xl"></div>
                ))}
            </div>
        );
    }

    const statItems = [
        { label: "Generations", value: stats?.total_generation || 0, icon: "auto_awesome", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/30" },
        { label: "Job Searches", value: stats?.job_searches || 0, icon: "search", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
        { label: "Avg Match", value: `${stats?.average_job_match || 0}%`, icon: "radar", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
        { label: "Avg ATS Score", value: stats?.average_ats_score || 0, icon: "fact_check", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
    ];

    return (
        <div className="mt-8 flex flex-wrap gap-4 items-center">
            {statItems.map((item, i) => (
                <div key={i} className="flex-1 min-w-[200px] flex items-center gap-4 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-transform hover:translate-y-[-2px]">
                    <div className={`w-12 h-12 rounded-xl flex shrink-0 items-center justify-center ${item.bg} ${item.color}`}>
                        <span className="material-icons-round">{item.icon}</span>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider truncate">{item.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
