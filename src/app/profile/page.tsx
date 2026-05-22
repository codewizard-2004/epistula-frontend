"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import styles from "./profile.module.css";
import Link from "next/link";

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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const confirmationPhrase = "Yes, delete my account";

    const history = [
        { id: 1, uuid: "an-782b-9x", type: "analysis", title: "Senior Frontend Developer", company: "Google", date: "2 hours ago" },
        { id: 2, uuid: "gen-k92l-4m", type: "generation", title: "Cover Letter", company: "Meta", date: "Yesterday" },
        { id: 3, uuid: "an-12p5-8r", type: "analysis", title: "Product Designer", company: "Airbnb", date: "3 days ago" },
        { id: 4, uuid: "gen-v88q-2n", type: "generation", title: "Cover Email", company: "Stripe", date: "1 week ago" },
    ];

    const subscription = {
        name: "Premium",
        price: "$19/mo",
        analysisLeft: 42,
        analysisTotal: 100,
        generationsLeft: 12,
        generationsTotal: 50,
        nextBilling: "April 15, 2026",
    };

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
                    {/* Left Column: Profile Overview & Subscription */}
                    <div className="flex flex-col gap-6">
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

                        {/* Subscription Section */}
                        <section className={styles.settingsSection}>
                            <div className={styles.sectionHeader}>
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                                    <span className="material-icons-round">subscriptions</span>
                                </div>
                                <h3 className={styles.sectionTitle}>Subscription</h3>
                            </div>
                            <div className={styles.glassPanel + " " + styles.settingsCard}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{subscription.name} Plan</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{subscription.price}</p>
                                    </div>
                                    <button className="text-xs font-bold text-indigo-500 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg hover:bg-indigo-100 transition">Upgrade</button>
                                </div>

                                <div className={styles.usageContainer}>
                                    <div className={styles.usageItem}>
                                        <div className={styles.usageHeader}>
                                            <span>Analysis Left</span>
                                            <span>{subscription.analysisLeft} / {subscription.analysisTotal}</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${(subscription.analysisLeft / subscription.analysisTotal) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.usageItem}>
                                        <div className={styles.usageHeader}>
                                            <span>Generations Left</span>
                                            <span>{subscription.generationsLeft} / {subscription.generationsTotal}</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${(subscription.generationsLeft / subscription.generationsTotal) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
                                    Next billing date: <strong>{subscription.nextBilling}</strong>
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Settings & History */}
                    <div className="flex flex-col gap-8">
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

                        {/* Generation & Analysis History */}
                        <section className={styles.settingsSection}>
                            <div className={styles.sectionHeader}>
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                                    <span className="material-icons-round">history</span>
                                </div>
                                <h3 className={styles.sectionTitle}>Recent Activity</h3>
                            </div>
                            <div className={styles.historyList}>
                                {history.map((item) => (
                                    <div key={item.id} className={styles.historyItem}>
                                        <div className="flex items-center">
                                            <div className={`${styles.historyIcon} ${item.type === "analysis"
                                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                                : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                                }`}>
                                                <span className="material-icons-round size-5">
                                                    {item.type === "analysis" ? "description" : "auto_fix_high"}
                                                </span>
                                            </div>
                                            <div className={styles.historyInfo}>
                                                <h4 className={styles.historyTitle}>{item.title}</h4>
                                                <p className={styles.historyDate}>{item.company} • {item.date}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={item.type === "analysis" ? `/analyze/result?id=${item.uuid}` : `/analyze/generation?id=${item.uuid}`}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-indigo-500"
                                        >
                                            <span className="material-icons-round text-sm">open_in_new</span>
                                        </Link>
                                    </div>
                                ))}
                                <button className="mt-2 text-center text-xs font-bold text-slate-500 hover:text-indigo-500 transition">View Full History</button>
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
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className={styles.dangerBtn}
                                    >
                                        Delete My Data
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.glassPanel + " " + styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-xl text-red-600">
                                <span className="material-icons-round">delete_forever</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Delete Account</h3>
                                <p className="text-xs text-slate-500">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className={styles.modalBody}>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                To confirm deletion, please type <span className="font-bold text-slate-800 dark:text-white select-none">"{confirmationPhrase}"</span> in the field below.
                            </p>
                            <input
                                type="text"
                                className={styles.input + " w-full"}
                                placeholder="Type the phrase here..."
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmation("");
                                }}
                                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={deleteConfirmation !== confirmationPhrase}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${deleteConfirmation === confirmationPhrase
                                    ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                Delete Account Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
