"use client"

import RecentGenerationItem from "./RecentGenerationItem"

export default function RecentGeneration() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Generations</h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-1 flex items-center cursor-pointer">
                    <span className="text-xs font-semibold px-2 text-gray-600 dark:text-gray-300">All</span>
                    <span className="material-icons-round text-sm text-gray-400">expand_more</span>
                </div>
            </div>
            <div className="space-y-2">
                <RecentGenerationItem title="Software Engineer XCorps" typeItem="Cover Letter" time="2 hours ago" />
                <RecentGenerationItem title="Product Designer Meta" typeItem="Analysis" time="2 hours ago" />
                <RecentGenerationItem title="Data Analyst Stripe" typeItem="Analysis" time="2 hours ago" />
                <RecentGenerationItem title="Data Analyst Stripe" typeItem="Cover Email x" time="2 hours ago" />
            </div>
        </div>
    )
}