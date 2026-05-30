"use client";

import { useState, useEffect } from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
    const [isDark, setIsDark] = useState(false);
    const pathname = usePathname();
    const [userName, setUserName] = useState("U");

    useEffect(() => {
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

        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
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
                    setUserName(user.email);
                }
            }
        };
        
        fetchUser();
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

    const isActive = (path: string) => pathname === path;

    return (
        <header className={styles.navbar}>
            <div className={styles.logoArea}>
                <div className={styles.logoIcon}>
                <Image src="/logo.png" alt="Epistula AI Logo" width={48} height={48} priority className="rounded-[14px] shadow-sm" />
                </div>
                <h1 className={styles.logoText}>
                    Epistula <span className={styles.logoHighlight}>AI</span>
                </h1>
            </div>

            <nav className={styles.navLinks}>
                <Link href="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.navItemActive : ''}`}>
                    Overview
                </Link>
                <Link href="/analyze" className={`${styles.navItem} ${isActive('/analyze') ? styles.navItemActive : ''}`}>
                    Analyze Resume
                </Link>
                <Link href="/analyze/generation" className={`${styles.navItem} ${isActive('/analyze/generation') ? styles.navItemActive : ''}`}>
                    Draft Generator
                </Link>
                <Link href="/jobs" className={`${styles.navItem} ${isActive('/jobs') ? styles.navItemActive : ''}`}>
                    Find Job
                </Link>

            </nav>

            <div className={styles.actionArea}>
                <button
                    className={styles.themeToggle}
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                >
                    <span className="material-icons-round text-xl">
                        {isDark ? "light_mode" : "dark_mode"}
                    </span>
                </button>
                <Link
                    href="/profile"
                    className={`${styles.profilePic} ${isActive('/profile') ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
                >
                    {userName.charAt(0).toUpperCase()}
                </Link>
            </div>
        </header>
    );
}
