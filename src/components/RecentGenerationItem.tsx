"use client"

export default function RecentGenerationItem({ title, typeItem, time }: { title: string, typeItem: string, time: string }) {
    return (
        <div className="group cursor-pointer">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeItem === "Analysis" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"}`}>
                        <span className="material-icons-round text-lg">{typeItem === "Analysis" ? "description" : "auto_fix_high"}</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-accent transition-colors line-clamp-1">{title}</h4>
                        <p className="text-xs text-gray-500">{typeItem} • {time}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}