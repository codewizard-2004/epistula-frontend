"use client";

import styles from "./MatchScoreCard.module.css";

interface MatchScoreCardProps {
    score: number;
    targetRole: string;
    company: string;
    tags: string[];
}

export default function MatchScoreCard({ score, targetRole, company, tags }: MatchScoreCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h2 className={styles.title}>Job Match Score</h2>
                <span className="material-icons-round opacity-70">work</span>
            </div>
            <div className={styles.scoreContainer}>
                <span className={styles.scoreValue}>{score}</span>
                <span className={styles.scoreTotal}>/100</span>
            </div>
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${score}%` }}></div>
            </div>
            <p className={styles.description}>
                Matches description for <strong>{targetRole}</strong> at <strong>{company}</strong>.
            </p>
            <div className={styles.tagContainer}>
                {tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>{tag}</span>
                ))}
            </div>
        </div>
    );
}
