"use client";

import { useState, useEffect } from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isDark, setIsDark] = useState(false);
    const pathname = usePathname();

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
                    <span className="material-icons-round text-2xl">mark_email_unread</span>
                </div>
                <h1 className={styles.logoText}>Epistula AI</h1>
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
                    <img
                        alt="User Profile"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBicSWD_kQyrbudKa2pZLs3ZcAkdJpZ8E66OiP0djkNN_Fnxe6vPpMWbyU_30qVTDqP9A3kJZ3BEgQL5VhjpPM1rNoZAVjrgAP2PFTCYPoNnOJzRCS1z9vdbwAgOIRdrFITU4prvRWlLS3ISMP8dm7q6mF-dQGC4NOCIhDfOC-CA6px1jU9aGdr_DQyY8cQJkExwHXvnTXLVpLzQTs_MU2bmPHWGeg4Anhea2kZFASYncm6mhANxuLO_RXs4Xs4AYRz8Wv1KZ2UseU"
                    />
                </Link>
            </div>
        </header>
    );
}
