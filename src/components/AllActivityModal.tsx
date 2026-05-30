"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import RecentGenerationItem from "./RecentGenerationItem"

type ActivityData = {
    id: string;
    title: string;
    typeItem: string;
    createdAt: string;
    score?: number;
}

type ActivityItem = ActivityData & {
    onClick: () => void;
}

function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `Just now`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return `Yesterday`;
    if (diffInDays < 30) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
}

export default function AllActivityModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [filterDate, setFilterDate] = useState("");

    const router = useRouter();

    useEffect(() => {
        if (!isOpen) return;

        const fetchActivities = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch Generations
                const { data: genData } = await supabase
                    .from("GENERATION_RESULT")
                    .select("id, name, created_at")
                    .eq("user_id", user.id);

                // Fetch Analyses
                const { data: jobData } = await supabase
                    .from("ANALYSIS_JOB")
                    .select(`
                        id,
                        generation_name,
                        ANALYSIS_RESULT (
                            result_id,
                            created_at,
                            ats_result
                        )
                    `)
                    .eq("user_id", user.id);

                const fetchedActivities: ActivityData[] = [];

                if (genData) {
                    genData.forEach((gen) => {
                        fetchedActivities.push({
                            id: gen.id,
                            title: gen.name || "Draft Generation",
                            typeItem: "Cover Letter",
                            createdAt: gen.created_at
                        });
                    });
                }

                if (jobData) {
                    jobData.forEach((job: any) => {
                        if (job.ANALYSIS_RESULT) {
                            const results = Array.isArray(job.ANALYSIS_RESULT) ? job.ANALYSIS_RESULT : [job.ANALYSIS_RESULT];
                            results.forEach((res: any) => {
                                let score = undefined;
                                if (res.ats_result && typeof res.ats_result.score === "number") {
                                    score = res.ats_result.score;
                                }
                                fetchedActivities.push({
                                    id: res.result_id,
                                    title: job.generation_name || "Resume Analysis",
                                    typeItem: "Analysis",
                                    createdAt: res.created_at,
                                    score
                                });
                            });
                        }
                    });
                }

                fetchedActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                const finalActivities = fetchedActivities.map((item) => ({
                    ...item,
                    onClick: item.typeItem === "Analysis" 
                        ? () => router.push(`/analyze/result?id=${item.id}`)
                        : () => router.push(`/analyze/generation?genId=${item.id}`)
                }));

                setActivities(finalActivities);
            } catch (err) {
                console.error("Failed to fetch activities", err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [isOpen, router]);

    const filteredActivities = useMemo(() => {
        return activities.filter((item) => {
            // Text Search
            if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            // Type Filter
            if (filterType !== "All" && item.typeItem !== filterType) {
                return false;
            }
            // Date Filter
            if (filterDate) {
                const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
                if (itemDate !== filterDate) {
                    return false;
                }
            }
            return true;
        });
    }, [activities, searchQuery, filterType, filterDate]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-black/40">
            <div className="bg-white dark:bg-surface-dark w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col border border-gray-100 dark:border-gray-800 overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Activity</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and search through your past generations and analyses.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 bg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input 
                            type="text" 
                            placeholder="Search by name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary-accent outline-none transition-all dark:text-white"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary-accent outline-none transition-all dark:text-white cursor-pointer"
                        >
                            <option value="All">All Types</option>
                            <option value="Analysis">Analyzed Resume</option>
                            <option value="Cover Letter">Generated Cover Letter</option>
                        </select>
                        <input 
                            type="date" 
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary-accent outline-none transition-all dark:text-white cursor-pointer"
                        />
                    </div>
                </div>

                {/* Activity List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent"></div>
                        </div>
                    ) : filteredActivities.length > 0 ? (
                        <div className="space-y-2">
                            {filteredActivities.map((item) => (
                                <div key={`${item.typeItem}-${item.id}`} className="p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                    <RecentGenerationItem
                                        title={item.title}
                                        typeItem={item.typeItem}
                                        time={new Date(item.createdAt).toLocaleString()}
                                        onClick={item.onClick}
                                        score={item.score}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                            <span className="material-icons-round text-4xl mb-2 opacity-50">search_off</span>
                            <p>No activity found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
