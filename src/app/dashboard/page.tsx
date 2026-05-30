"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RecentGeneration from "@/components/RecentGeneration";
import Statistics from "@/components/Statistics";
import AllActivityModal from "@/components/AllActivityModal";
import styles from "./dashboard.module.css";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
    const router = useRouter();
    const [userName, setUserName] = useState("Alex");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login");
                return;
            }

            // Fetch name from USERS table using user.id
            const { data, error } = await supabase
                .from("USERS")
                .select("name")
                .eq("id", user.id)
                .single();

            if (data && data.name) {
                setUserName(data.name);
            } else if (user.user_metadata?.full_name) {
                setUserName(user.user_metadata.full_name);
            } else if (user.email) {
                const emailUser = user.email.split("@")[0];
                setUserName(emailUser.charAt(0).toUpperCase() + emailUser.slice(1));
            }
        };

        checkUser();
    }, [router]);
    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen transition-colors duration-300 relative overflow-x-clip flex h-screen overflow-hidden">
            <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 -z-10"></div>
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200 dark:bg-purple-900/20 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-blue-200 dark:bg-blue-900/20 rounded-full blur-[80px] opacity-30 pointer-events-none"></div>

                <Navbar />
                
                <AllActivityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                <div className="p-12 max-w-[1400px] mx-auto w-full flex flex-col gap-10 mt-4">
                    {/* Welcome Area */}
                    <div>
                        <h2 className="text-gray-900 dark:text-white mb-3 font-bold text-4xl">Optimize Your Career Path</h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 font-light">Leverage AI to refine your application and accelerate your job search.</p>
                        <Statistics />
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-min">
                        {/* Primary Large Card (Spans 2 columns) */}
                        <div className={`md:col-span-2 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm p-10 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full ${styles.primaryCard}`}>
                            <div className="flex flex-col md:flex-row gap-8 h-full">
                                <div className="flex-1 flex flex-col">
                                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105">
                                        <span className="material-icons-round text-3xl">speed</span>
                                    </div>
                                    <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Analyze Resume</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-light text-lg">Maximize your callback rate. Get an instant ATS compatibility score and actionable feedback to highlight your key strengths to recruiters.</p>
                                    <div className="mt-auto">
                                        <button className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-4 transition-all" onClick={() => router.push("/analyze/generation?source=direct")}>
                                            Start Analysis
                                            <div className="w-10 h-10 rounded-full border border-blue-200 dark:border-blue-800 flex items-center justify-center bg-white dark:bg-blue-900/20 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 transition-colors">
                                                <span className="material-icons-round">arrow_forward</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div className="hidden md:flex flex-1 items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                                    {/* Decorative visual element placeholder */}
                                    <div className="relative w-full aspect-square max-w-[200px]">
                                        <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-800/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                        <div className="absolute inset-4 border-4 border-dashed border-blue-200 dark:border-blue-700/50 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="material-icons-round text-6xl text-blue-300 dark:text-blue-600/50">document_scanner</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tall Vertical Card: Recent Activity (Spans 2 rows) */}
                        <div className="md:row-span-2 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col h-full shadow-sm glass-effect">
                            <div className="flex justify-between items-end mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                                <button onClick={() => setIsModalOpen(true)} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium">View all</button>
                            </div>
                            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
                                <RecentGeneration />
                            </div>
                        </div>

                        {/* Medium Card 1 */}
                        <div className={`bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full ${styles.mediumCard1}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
                                    <span className="material-icons-round">work_outline</span>
                                </div>
                                <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 group-hover:text-orange-600 group-hover:border-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                    <span className="material-icons-round text-sm">arrow_forward</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Find Jobs</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-2 leading-relaxed font-light text-sm">Uncover hidden opportunities. Let AI match your unique profile with high-potential roles.</p>
                        </div>

                        {/* Medium Card 2 */}
                        <div onClick={() => router.push('/analyze/generation?source=direct')} className={`bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full ${styles.mediumCard2}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
                                    <span className="material-icons-round">auto_awesome</span>
                                </div>
                                <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:border-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    <span className="material-icons-round text-sm">arrow_forward</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Generate Letter</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-2 leading-relaxed font-light text-sm">Stand out effortlessly. Auto-draft compelling narratives customized to any job description.</p>
                        </div>
                    </div>
                </div>

                <button className="xl:hidden fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl z-50 flex items-center justify-center">
                    <span className="material-icons-round">add</span>
                </button>
            </main>
        </div>
    );
}
