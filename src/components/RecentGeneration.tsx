"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import RecentGenerationItem from "./RecentGenerationItem"

type ActivityItem = {
    id: string;
    title: string;
    typeItem: string;
    createdAt: string;
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

export default function RecentGeneration() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchActivities = async () => {
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
                            created_at
                        )
                    `)
                    .eq("user_id", user.id);

                const fetchedActivities: ActivityItem[] = [];

                if (genData) {
                    genData.forEach((gen) => {
                        fetchedActivities.push({
                            id: gen.id,
                            title: gen.name || "Draft Generation",
                            typeItem: "Cover Letter",
                            createdAt: gen.created_at,
                            onClick: () => router.push(`/analyze/generation?id=${gen.id}`)
                        });
                    });
                }

                if (jobData) {
                    jobData.forEach((job: any) => {
                        if (job.ANALYSIS_RESULT) {
                            const results = Array.isArray(job.ANALYSIS_RESULT) ? job.ANALYSIS_RESULT : [job.ANALYSIS_RESULT];
                            results.forEach((res: any) => {
                                fetchedActivities.push({
                                    id: res.result_id,
                                    title: job.generation_name || "Resume Analysis",
                                    typeItem: "Analysis",
                                    createdAt: res.created_at,
                                    onClick: () => router.push(`/analyze/result?id=${res.result_id}`)
                                });
                            });
                        }
                    });
                }

                fetchedActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setActivities(fetchedActivities.slice(0, 5));
            } catch (err) {
                console.error("Failed to fetch activities", err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [router]);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="space-y-6">
                {loading ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Loading...</p>
                ) : activities.length > 0 ? (
                    activities.map((item) => (
                        <RecentGenerationItem
                            key={`${item.typeItem}-${item.id}`}
                            title={item.title}
                            typeItem={item.typeItem}
                            time={formatTimeAgo(item.createdAt)}
                            onClick={item.onClick}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent activity found.</p>
                )}
            </div>
        </div>
    )
}