"use client";

import styles from "./ATSScoreCircle.module.css";

interface ATSScoreCircleProps {
    score: number;
    label: string;
    description: string;
}

export default function ATSScoreCircle({ score, label, description }: ATSScoreCircleProps) {
    const radius = 88;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - score / 100);

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>ATS Friendliness</h2>
            <div className={styles.progressCircle}>
                <svg className={styles.progressRing} width="192" height="192">
                    <circle
                        className={styles.ringBg}
                        cx="96" cy="96" fill="transparent" r={radius}
                        stroke="currentColor" strokeWidth="12"
                    ></circle>
                    <circle
                        className={styles.ringFill}
                        cx="96" cy="96" fill="transparent" r={radius}
                        stroke="currentColor" strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    ></circle>
                </svg>
                <div className={styles.scoreOverlay}>
                    <span className={styles.scoreText}>
                        {score}<span className={styles.percentText}>%</span>
                    </span>
                    <span className={styles.labelTag}>{label}</span>
                </div>
            </div>
            <p className={styles.description}>{description}</p>
        </div>
    );
}
