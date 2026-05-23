"use client"

export default function RecentGenerationItem({ title, typeItem, time, onClick }: { title: string, typeItem: string, time: string, onClick?: () => void }) {
    const displayTitle = typeItem === "Analysis" ? "Analyzed Resume" : "Generated Cover Letter";
    const displaySubtitle = title;
    
    const isAnalysis = typeItem === "Analysis";
    
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
                <div className="flex flex-col">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-accent transition-colors">{displayTitle}</h4>
                    <p className="text-xs text-gray-500 font-light mt-0.5 line-clamp-1">{displaySubtitle}</p>
                    <span className="text-[10px] text-gray-400 font-medium block mt-1.5 uppercase tracking-wider">{time}</span>
                </div>
            </div>
        </div>
    )
}