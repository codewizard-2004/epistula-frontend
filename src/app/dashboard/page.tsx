import Link from "next/link";
import RecentGeneration from "@/components/RecentGeneration";
import styles from "./dashboard.module.css";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen transition-colors duration-300 relative overflow-x-clip">
            {/* Background Effects */}
            <div className={styles.bgGradient}></div>
            <div className={styles.blobTop}></div>
            <div className={styles.blobBottom}></div>

            <Navbar />

            <main className="relative z-10">

                {/* Content */}
                <div className="p-8 max-w-[1600px] mx-auto w-full">
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div>
                            <h2 className={styles.welcomeTitle}>Good morning, Alex 👋</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                                Your job search is on track — 3 new matches since yesterday.
                            </p>
                        </div>
                        <Link href="/analyze/generation?source=direct" className={styles.newGenButton}>
                            <span className="material-icons-round">add</span>
                            New Generation
                        </Link>
                    </div>

                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {/* Letters Generated */}
                        <div className={styles.statsCard}>
                            <div className={`${styles.statsIconContainer} bg-orange-100/50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400`}>
                                <span className="material-icons-round text-3xl">article</span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold tracking-tighter">12</span>
                                </div>
                                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Letters Generated</div>
                                <div className={`${styles.statsBadge} bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400`}>
                                    +3 this week
                                </div>
                            </div>
                        </div>

                        {/* Job Matches */}
                        <div className={styles.statsCard}>
                            <div className={`${styles.statsIconContainer} bg-green-100/50 dark:bg-green-950/30 text-green-600 dark:text-green-400`}>
                                <span className="material-icons-round text-3xl">work_outline</span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold tracking-tighter">24</span>
                                </div>
                                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job Matches</div>
                                <div className={`${styles.statsBadge} bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400`}>
                                    +5 today
                                </div>
                            </div>
                        </div>

                        {/* ATS Score */}
                        <div className={styles.statsCard}>
                            <div className={`${styles.statsIconContainer} bg-blue-100/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400`}>
                                <span className="material-icons-round text-3xl">speed</span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold tracking-tighter">78%</span>
                                </div>
                                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ATS Score</div>
                                <div className={`${styles.statsBadge} bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400`}>
                                    +2pts
                                </div>
                            </div>
                        </div>

                        {/* Top Match */}
                        <div className={styles.statsCard}>
                            <div className={`${styles.statsIconContainer} bg-purple-100/50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400`}>
                                <span className="material-icons-round text-3xl">trending_up</span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold tracking-tighter">95%</span>
                                </div>
                                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top Match</div>
                                <div className={`${styles.statsBadge} bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400`}>
                                    High fit
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        <div className="xl:col-span-12 flex flex-col gap-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Recent Generations */}
                                <div className={`bg-white dark:bg-surface-dark p-6 rounded-2xl ${styles.shadowSoft} dark:shadow-none border border-gray-100 dark:border-gray-800`}>

                                    <div className="space-y-6">
                                        <RecentGeneration />
                                    </div>
                                </div>

                                {/* Top Job Matches */}
                                <div className={`bg-white dark:bg-surface-dark p-6 rounded-2xl ${styles.shadowSoft} dark:shadow-none border border-gray-100 dark:border-gray-800`}>
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Job Matches</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Tailored to your profile</p>
                                        </div>
                                        <button className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">See All</button>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img alt="Company" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrXzHz4lm_lIs9yRk2ogPAJmt9m-sZ8lko2_hozPLL8cd8V4DqaCoXaqcyhg8E3ySopmgLR8pQiVpWmTWrob6CWNdPULY6apnxYHLzQD393oBeGSl4AZWrO0FiP41Md1doY6V9QsJQuq-zXi-5Ppx_VACRGJsOrM3RV6HOZE2z0aRfhmXyr20cyVnEBeVki2eAxB2tjADD1MRVBkU4ROcMgdNUg-m9-boXo1tTOTHhsrYY9XaU2y1pB8Sn0Q6nrcSJlGW39VraEmM" />
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">Senior Frontend Dev</h4>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                        <span className="material-icons-round text-[12px]">location_on</span> Remote
                                                        <span>•</span>
                                                        <span className="material-icons-round text-[12px]">schedule</span> Full-time
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">95%</div>
                                                <div className="text-[10px] text-green-500 font-semibold">High Match</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img alt="Company" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwEUUyPnbQq1sJrMSBUck_hloFv2u69GYYDYnzF07gAzF-61ZCfGLt4OB1nB7Rg9v8qbeamQGaCEjocfS4X-FRdloJ0srdXXeLMCTgUcUdiUIFCd7AImNDJ_DjHtw8Fu1TVaCDm37IzH3jKFI4LISm_H86M3f32dTLE72Yv73hLfLafRS2rIPDwOasiJDt88L0jV1PWflBV561JAomUXCRtFe3cOBYq7IjgEs9n1BY9Hsm55miDheFH2ITw2ZG8dYV8MzxIQszgv8" />
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">UI/UX Lead</h4>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                        <span className="material-icons-round text-[12px]">location_on</span> New York
                                                        <span>•</span>
                                                        <span className="material-icons-round text-[12px]">schedule</span> Contract
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">88%</div>
                                                <div className="text-[10px] text-blue-500 font-semibold">Good Match</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img alt="Company" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQzwhNcqgCWNWPpaqm5cwCK-A7-WMNlSug78Jm2rCp6N_60Ov2jo_IPX7-6k2wkZytzF6zrOXVb_JrFWJkQxoPD3xQOa9x9IYCV5rnE4xnQEWBkNfhYAAzbAL4IXVU5utNEBhxvtTk63obQGVo-CYdd9JvfBYjkhuI7EdkdfiPw2PZPnKf6h0JLFUXIPchmmVHzVwXR4doAUYUXVE9t6eRRh2r6HAhnQq_WyKq1u6FvbxIwmghiYU-BrMZpM3r8oUR6iX2HYnX_8M" />
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">Product Designer</h4>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                        <span className="material-icons-round text-[12px]">location_on</span> London
                                                        <span>•</span>
                                                        <span className="material-icons-round text-[12px]">schedule</span> Full-time
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">82%</div>
                                                <div className="text-[10px] text-blue-500 font-semibold">Good Match</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <Link href="/analyze/generation?source=direct" className="bg-pastel-purple/50 dark:bg-indigo-900/20 p-8 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer h-full flex flex-col justify-between">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-white dark:bg-indigo-950 rounded-xl flex items-center justify-center shadow-sm text-indigo-600 dark:text-indigo-400">
                                                <span className="material-icons-round text-2xl">auto_awesome</span>
                                            </div>
                                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">New</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Generate Cover Letter</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Create a tailored cover letter based on your resume and the job description instantly.</p>
                                    </div>
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                <img alt="" className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaYj39mhbV5ZTWKxGHUF2CauLrTRSnkFeXut9RQPrQXuy4mC-bYC6cb5WnC2N-AInaPqIGivfvmg8rtVsbQyXoJzTb6DV7j_Mc6vaMEUF28VV7F3_f3aSb7LgHFp6ednUKLc5bmN24kQ9MQNPxzu4xIRzwpPu2cSUnAB4VeSRa2UjmyAJ_bC6ds-Ai-CcDN6UdUDEVabWjZsop3JEWax9YuL7Z4FwAqC3jIdrvsDNSgrIP4fSvBIZZLEMoicosyuiFJ3CKXpHs3cU" />
                                                <img alt="" className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKS9RRw_V_RN1zB5VFPsTum-MPfErBizKHfL7sOwNQuAdWAG23gFKuBZ4bsecNOGOmvC7ypRPdPJay08ZEy-d0BiRWGrWb7tBBiO7VL-WKREzRiNn8tLKGCc-FEC5fM3713mdW3D5DoIoR-AJ76glaZxB-le-7sWL0TbbkkzmXqDRPAJRM8_AjzRBntQbHChFhrKKAs3UUBB2wJEn20evcu5cY4KZb7JKJxs05zdV6s0Hn9r20wBEigYur5F6EI2mrUBY--chEEXU" />
                                            </div>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Used by 1.2k+ today</span>
                                        </div>
                                        <span className="material-icons-round text-indigo-600 dark:text-indigo-400 transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div >
                                </Link>
                                <div className="bg-pastel-orange/50 dark:bg-orange-900/20 p-8 rounded-2xl border border-orange-100 dark:border-orange-800/30 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer h-full flex flex-col justify-between">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-white dark:bg-orange-950 rounded-xl flex items-center justify-center shadow-sm text-orange-600 dark:text-orange-400">
                                                <span className="material-icons-round text-2xl">work_outline</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Find Jobs</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Discover career opportunities perfectly matched to your skills and preferences.</p>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-orange-700 dark:text-orange-300">Daily Matches Found</span>
                                            <span className="text-xs font-bold text-orange-700 dark:text-orange-300">24</span>
                                        </div>
                                        <div className="w-full bg-white/50 dark:bg-orange-950/50 rounded-full h-2 overflow-hidden">
                                            <div className="bg-orange-500 h-2 rounded-full w-2/3"></div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-300/30 dark:bg-orange-600/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                                </div>
                                <div className="bg-pastel-blue/50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-800/30 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer h-full flex flex-col justify-between">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-white dark:bg-blue-950 rounded-xl flex items-center justify-center shadow-sm text-blue-600 dark:text-blue-400">
                                                <span className="material-icons-round text-2xl">speed</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Check Resume Score</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Get instant feedback on your resume's formatting, keywords, and impact.</p>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">ATS Optimization Level</span>
                                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">78%</span>
                                        </div>
                                        <div className="w-full bg-white/50 dark:bg-blue-950/50 rounded-full h-2 overflow-hidden">
                                            <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300/30 dark:bg-blue-600/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Action Button mobile */}
                <button className="xl:hidden fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl z-50 flex items-center justify-center cursor-pointer">
                    <span className="material-icons-round">add</span>
                </button>
            </main>
        </div>
    );
}
