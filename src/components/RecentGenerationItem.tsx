"use client"

export default function RecentGenerationItem({ title, typeItem, time, onClick, score }: { title: string, typeItem: string, time: string, onClick?: () => void, score?: number }) {
    const displayTitle = typeItem === "Analysis" ? "Analyzed Resume" : "Generated Cover Letter";
    const displaySubtitle = title;
    
    const isAnalysis = typeItem === "Analysis";
    
    let scoreColorClass = "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400";
    if (score !== undefined) {
        if (score >= 80) scoreColorClass = "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400";
        else if (score >= 60) scoreColorClass = "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400";
        else scoreColorClass = "text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400";
    }
    
    return (
        <div className="group cursor-pointer py-1" onClick={onClick}>
            <div className="flex items-start gap-4">
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center mt-1 transition-colors ${
                    isAnalysis 
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50" 
                        : "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50"
                }`}>
                    <span className="material-icons-round text-sm">{isAnalysis ? "fact_check" : "description"}</span>
                </div>
                <div className="flex flex-col flex-1 w-full overflow-hidden">
                    <div className="flex items-center justify-between gap-2 w-full">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-accent transition-colors truncate">{displayTitle}</h4>
                        {isAnalysis && score !== undefined && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${scoreColorClass}`}>
                                {score}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 font-light mt-0.5 truncate">{displaySubtitle}</p>
                    <span className="text-[10px] text-gray-400 font-medium block mt-1.5 uppercase tracking-wider">{time}</span>
                </div>
            </div>
        </div>
    )
}