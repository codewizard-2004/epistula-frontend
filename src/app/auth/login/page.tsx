"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoginPage() {
    const [isDark, setIsDark] = useState(false);

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
        <div className="font-body bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="w-full max-w-7xl bg-white/60 dark:bg-surface-dark/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[800px] border border-white/20 dark:border-slate-700/50 glass-effect">

                {/* Left Side - Visual & Marketing */}
                <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gradient-mesh dark:bg-dark-gradient-mesh">
                    {/* Background Blobs */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent-purple/30 rounded-full blur-3xl filter animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent-blue/30 rounded-full blur-3xl filter"></div>

                    {/* Header */}
                    <div className="relative z-10">
                        <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg mb-6">
                            <span className="material-icons-outlined text-primary dark:text-white text-3xl">
                                mark_email_unread
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                            Epistula AI
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Craft your career story with intelligence.
                        </p>
                    </div>

                    {/* Floating Cards Visualization */}
                    <div className="relative z-10 flex flex-col gap-6 my-auto">
                        {/* Resume Score Card */}
                        <div className="bg-white/70 dark:bg-slate-800/70 p-5 rounded-2xl shadow-lg border border-white/40 dark:border-slate-600/30 transform hover:scale-[1.02] transition-transform duration-300 backdrop-blur-sm w-4/5 self-start">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-300">
                                    <span className="material-icons-outlined">analytics</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Resume Score
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        AI Analysis Complete
                                    </p>
                                </div>
                                <div className="ml-auto text-green-500 font-bold text-lg">
                                    94%
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: "94%" }}
                                ></div>
                            </div>
                        </div>

                        {/* Cover Letter Card */}
                        <div className="bg-white/70 dark:bg-slate-800/70 p-5 rounded-2xl shadow-lg border border-white/40 dark:border-slate-600/30 transform hover:scale-[1.02] transition-transform duration-300 backdrop-blur-sm w-4/5 self-end">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-600 dark:text-purple-300">
                                    <span className="material-icons-outlined">
                                        auto_fix_high
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Cover Letter
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Generated in 12s
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <span className="material-icons-outlined text-gray-400">
                                        check_circle
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="relative z-10 bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl backdrop-blur-md border border-white/20 dark:border-slate-700/20">
                        <div className="flex items-center gap-3">
                            <img
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-600"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA_Fpp0cVTWH9C1NCUxg5MhsbzXSlyk3C8iUe5T8vdrJsWAb3i0yYWsYNy0vEFD-FUPKYb1M7UDtY5zzdYs2yE43N7Y9_UgMdlalNEkgI4dHww1L-p7j9O5TcZhlSj123gK_k6SpXJo3NTzaq_W2YbnYP9qdaTleFv5oM91yyzf3bmHk24a7RPVY8_X8JA_28nAhl97Id2B1D3KnCOhlJAP9qEyiMYpgociYav8o6SzfHHrKeBqJixO-tmWhh2h86zBGg3_cAFv4A"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    &quot;Landed my dream job at TechCorp thanks to Epistula!&quot;
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Sarah J., Product Designer
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 bg-white dark:bg-surface-dark flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 relative">

                    {/* Mobile Header */}
                    <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
                        <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-xl">
                            <span className="material-icons-outlined text-primary dark:text-white">
                                mark_email_unread
                            </span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-xl">
                            Epistula AI
                        </span>
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-400 cursor-pointer"
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                    >
                        {isDark ? (
                            <span className="material-icons-outlined block">light_mode</span>
                        ) : (
                            <span className="material-icons-outlined block">dark_mode</span>
                        )}
                    </button>

                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                Please enter your details to access your workspace.
                            </p>
                        </div>

                        {/* Social Login */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 group bg-white dark:bg-slate-800 cursor-pointer">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4" />
                                    <path d="M12.24 24.0008C15.4765 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853" />
                                    <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05" />
                                    <path d="M12.24 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.24 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.24 4.74966Z" fill="#EA4335" />
                                </svg>
                                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                                    Google
                                </span>
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 group bg-white dark:bg-slate-800 cursor-pointer">
                                <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                                    LinkedIn
                                </span>
                            </button>
                        </div>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-sm">
                                Or continue with email
                            </span>
                            <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
                        </div>

                        {/* Email Form */}
                        <form action="#" className="space-y-6" method="POST">
                            <div className="space-y-5">
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1"
                                        htmlFor="email"
                                    >
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-icons-outlined text-gray-400">
                                                email
                                            </span>
                                        </div>
                                        <input
                                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                            id="email"
                                            name="email"
                                            placeholder="name@company.com"
                                            required
                                            type="email"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2 ml-1">
                                        <label
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            htmlFor="password"
                                        >
                                            Password
                                        </label>
                                        <a
                                            className="text-sm font-medium text-primary dark:text-white hover:underline opacity-80 hover:opacity-100"
                                            href="#"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-icons-outlined text-gray-400">
                                                lock
                                            </span>
                                        </div>
                                        <input
                                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                            id="password"
                                            name="password"
                                            placeholder="••••••••"
                                            required
                                            type="password"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center ml-1">
                                <input
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                />
                                <label
                                    className="ml-2 block text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                                    htmlFor="remember-me"
                                >
                                    Remember me for 30 days
                                </label>
                            </div>
                            <button
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-gray-200 dark:shadow-none cursor-pointer"
                                type="submit"
                            >
                                Sign in to Dashboard
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                            Don&apos;t have an account?{" "}
                            <a
                                className="font-bold text-primary dark:text-white hover:underline"
                                href="#"
                            >
                                Sign up for free
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Background Glows for Main Container */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
}
