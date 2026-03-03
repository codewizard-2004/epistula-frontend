"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import styles from "./profile.module.css";

export default function ProfilePage() {
    const [user, setUser] = useState({
        name: "Alex Dev",
        email: "alex.dev@example.com",
        location: "San Francisco, CA",
        role: "Senior Software Engineer",
        plan: "Premium",
        resumesAnalyzed: 24,
        lettersGenerated: 18,
    });

    return (
        <div className="font-body min-h-screen transition-colors duration-300 relative">
            <Navbar />

            {/* Background Effects */}
            <div className={styles.bgGradient}></div>
            <div className={styles.blob + " " + styles.blob1}></div>
            <div className={styles.blob + " " + styles.blob2}></div>

            <main className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>My Profile</h1>
                    <p className={styles.subtitle}>Manage your account settings and preferences.</p>
                </header>

                <div className={styles.grid}>
                    {/* Left Column: Profile Overview */}
                    <aside>
                        <div className={styles.glassPanel + " " + styles.profileCard}>
                            <div className={styles.avatarWrapper}>
                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                    {user.name.charAt(0)}
                                </div>
                                <button className={styles.editAvatarBtn} title="Update Avatar">
                                    <span className="material-icons-round text-sm">photo_camera</span>
                                </button>
                            </div>
                            <h2 className={styles.userName}>{user.name}</h2>
                            <p className={styles.userEmail}>{user.email}</p>
                            <span className={styles.planTag}>{user.plan} Plan</span>

                            <div className={styles.statsGrid}>
                                <div className={styles.statItem}>
                                    <span className={styles.statValue}>{user.resumesAnalyzed}</span>
                                    <span className={styles.statLabel}>Resumes</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statValue}>{user.lettersGenerated}</span>
                                    <span className={styles.statLabel}>Drafts</span>
                                </div>
                            </div>

                            <button className="mt-8 text-slate-500 dark:text-slate-400 text-xs font-semibold flex items-center gap-2 hover:text-indigo-500 transition">
                                <span className="material-icons-round text-sm">logout</span>
                                Sign Out
                            </button>
                        </div>
                    </aside>

                    {/* Right Column: Settings */}
                    <div className="flex flex-col gap-4">
                        {/* Account Details Area */}
                        <section className={styles.settingsSection}>
                            <div className={styles.sectionHeader}>
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                                    <span className="material-icons-round">person</span>
                                </div>
                                <h3 className={styles.sectionTitle}>Account Information</h3>
                            </div>
                            <div className={styles.glassPanel + " " + styles.settingsCard}>
                                <div className={styles.settingsGrid}>
                                    <div className={styles.settingGroup}>
                                        <label className={styles.label}>Full Name</label>
                                        <input type="text" className={styles.input} defaultValue={user.name} />
                                    </div>
                                    <div className={styles.settingGroup}>
                                        <label className={styles.label}>Email Address</label>
                                        <input type="email" className={styles.input} defaultValue={user.email} />
                                    </div>
                                    <div className={styles.settingGroup}>
                                        <label className={styles.label}>Job Role</label>
                                        <input type="text" className={styles.input} defaultValue={user.role} />
                                    </div>
                                    <div className={styles.settingGroup}>
                                        <label className={styles.label}>Location</label>
                                        <input type="text" className={styles.input} defaultValue={user.location} />
                                    </div>
                                </div>
                                <button className={styles.saveBtn}>Update Details</button>
                            </div>
                        </section>

                        {/* Security Section */}
                        <section className={styles.settingsSection}>
                            <div className={styles.sectionHeader}>
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                    <span className="material-icons-round">security</span>
                                </div>
                                <h3 className={styles.sectionTitle}>Security & Access</h3>
                            </div>
                            <div className={styles.glassPanel + " " + styles.settingsCard}>
                                <div className="flex flex-col gap-4">

                                    <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-slate-800/20 rounded-xl border border-white/20">
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">Change Password</h4>
                                            <p className="text-xs text-slate-500 mt-1">Keep your account secure by updating your password regularly.</p>
                                        </div>
                                        <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600">Update</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Dangerous Zone */}
                        <section className={styles.settingsSection}>
                            <div className={styles.sectionHeader}>
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                                    <span className="material-icons-round">error_outline</span>
                                </div>
                                <h3 className={styles.sectionTitle}>Danger Zone</h3>
                            </div>
                            <div className={styles.glassPanel + " " + styles.settingsCard}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">Delete Account</h4>
                                        <p className="text-xs text-slate-500 mt-1">Strictly permanent. Once deleted, your data cannot be recovered.</p>
                                    </div>
                                    <button className={styles.dangerBtn}>Delete My Data</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
