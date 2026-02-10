"use client";

import { useState, useEffect } from "react";

export default function PricingPage() {
    const [isDark, setIsDark] = useState(false);
    const [isAnnual, setIsAnnual] = useState(false);

    useEffect(() => {
        // Check system preference or local storage on mount
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDark(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
            setIsDark(true);
        }
    };

    return (
        <div className="font-body bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/20 dark:border-slate-700/30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary dark:bg-slate-800 p-2 rounded-xl">
                            <span className="material-icons-outlined text-white text-2xl">
                                mark_email_unread
                            </span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-xl tracking-tight">
                            Epistula AI
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-400 cursor-pointer"
                            onClick={toggleTheme}
                        >
                            {isDark ? (
                                <span className="material-symbols-outlined block">light_mode</span>
                            ) : (
                                <span className="material-symbols-outlined block">dark_mode</span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 bg-gradient-mesh dark:bg-dark-gradient-mesh"></div>
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px]"></div>
            </div>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Choose Your Career Catalyst
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                        Unlock the power of AI to transform your job applications. From
                        entry-level starts to professional domination.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>Monthly</span>
                        <button
                            className={`relative w-14 h-8 bg-gray-200 dark:bg-slate-700 rounded-full transition-colors focus:outline-none cursor-pointer`}
                            onClick={() => setIsAnnual(!isAnnual)}
                        >
                            <div className={`absolute left-1 top-1 w-6 h-6 bg-white dark:bg-primary rounded-full shadow-sm transition-transform duration-200 ${isAnnual ? 'translate-x-6' : ''}`}></div>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>Annual</span>
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Save 20%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {/* Novice Plan */}
                    <div className="glass-effect p-8 rounded-3xl flex flex-col h-full transform hover:scale-[1.02] transition-all duration-300">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                The Novice
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Perfect for exploring the possibilities.
                            </p>
                        </div>
                        <div className="mb-8">
                            <span className="text-5xl font-bold text-gray-900 dark:text-white">
                                $0
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">/month</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow">
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-green-500 text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm">3 AI Resume Analyses /mo</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-green-500 text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm">1 Cover Letter Generation</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-green-500 text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm">Basic Skill Suggestions</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
                                <span className="material-symbols-outlined text-xl">
                                    cancel
                                </span>
                                <span className="text-sm line-through">Custom Formatting</span>
                            </li>
                        </ul>
                        <button className="w-full py-4 border-2 border-primary dark:border-white/20 rounded-xl font-bold text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition-all duration-300 cursor-pointer">
                            Get Started Free
                        </button>
                    </div>

                    {/* Professional Plan */}
                    <div className="glass-effect card-popular p-8 rounded-3xl flex flex-col h-full relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300 bg-white/60 dark:bg-slate-800/60">
                        <div className="absolute top-0 right-0">
                            <div className="bg-accent-purple text-primary text-[10px] font-bold px-4 py-1.5 transform rotate-45 translate-x-6 translate-y-2 w-32 text-center uppercase">
                                Popular
                            </div>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                The Professional
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Our most popular choice for career growth.
                            </p>
                        </div>
                        <div className="mb-8">
                            <span className="text-5xl font-bold text-gray-900 dark:text-white">
                                ${isAnnual ? 19 * 12 * 0.8 / 12 : 19}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">/month</span>
                            {isAnnual && <div className="text-xs text-green-500 font-medium mt-1">Billed ${19 * 12 * 0.8} yearly</div>}
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow">
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-accent-purple text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm font-medium">
                                    Unlimited Resume Analyses
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-accent-purple text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm font-medium">
                                    15 Cover Letters /mo
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-accent-purple text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm">Keyword Optimization</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-accent-purple text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm">Export to PDF & DOCX</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-accent-purple text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm">LinkedIn Profile Auditor</span>
                            </li>
                        </ul>
                        <button className="w-full py-4 bg-primary dark:bg-white text-white dark:text-primary rounded-xl font-bold shadow-lg shadow-purple-200 dark:shadow-none hover:bg-primary-hover dark:hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                            Upgrade to Pro
                        </button>
                    </div>

                    {/* Visionary Plan */}
                    <div className="glass-effect p-8 rounded-3xl flex flex-col h-full transform hover:scale-[1.02] transition-all duration-300">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                The Visionary
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                For agencies and power users.
                            </p>
                        </div>
                        <div className="mb-8">
                            <span className="text-5xl font-bold text-gray-900 dark:text-white">
                                ${isAnnual ? 49 * 12 * 0.8 / 12 : 49}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">/month</span>
                            {isAnnual && <div className="text-xs text-green-500 font-medium mt-1">Billed ${49 * 12 * 0.8} yearly</div>}

                        </div>
                        <ul className="space-y-4 mb-10 flex-grow">
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-accent-blue text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm">Everything in Professional</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-accent-blue text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm">Unlimited Everything</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-accent-blue text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm">Custom AI Model Training</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-accent-blue text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm">White-label Branding</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined text-accent-blue text-xl">
                                    check_circle
                                </span>
                                <span className="text-sm">Priority 24/7 Support</span>
                            </li>
                        </ul>
                        <button className="w-full py-4 border-2 border-primary dark:border-white/20 rounded-xl font-bold text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition-all duration-300 cursor-pointer">
                            Contact Enterprise
                        </button>
                    </div>
                </div>

                {/* Logos */}
                <div className="mt-24 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8">
                        TRUSTED BY PROFESSIONALS AT
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter">
                            CLOUDCORE
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter">
                            TECHSTREAM
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter">
                            DATAFLOW
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter">
                            VANTAGE
                        </span>
                    </div>
                </div>
            </main>

            {/* Footer CTA */}
            <div className="max-w-7xl mx-auto px-6 mb-20">
                <div className="glass-effect rounded-3xl p-12 text-center bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border-white/40">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                        Our career experts are here to help you find the right plan for your
                        journey.
                    </p>
                    <a
                        className="inline-flex items-center gap-2 font-bold text-primary dark:text-white hover:underline decoration-accent-purple underline-offset-4"
                        href="#"
                    >
                        Chat with our team{" "}
                        <span className="material-symbols-outlined text-sm">
                            arrow_forward
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}
