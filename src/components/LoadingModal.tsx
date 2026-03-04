"use client";

import { useState, useEffect } from "react";
import styles from "./LoadingModal.module.css";

interface Step {
    title: string;
    description: string;
}

interface LoadingModalProps {
    isOpen: boolean;
    onComplete: () => void;
    steps: Step[];
}

export default function LoadingModal({ isOpen, onComplete, steps }: LoadingModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [processId] = useState(() => `#${Math.floor(Math.random() * 1000)}-AI`);
    const [timeLeft, setTimeLeft] = useState(12);

    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(0);
            setTimeLeft(12);
            return;
        }

        if (currentStep < steps.length) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 2000); // 2 seconds per step

            const countdown = setInterval(() => {
                setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);

            return () => {
                clearTimeout(timer);
                clearInterval(countdown);
            };
        } else {
            // All steps complete
            const finalTimer = setTimeout(() => {
                onComplete();
            }, 800);
            return () => clearTimeout(finalTimer);
        }
    }, [isOpen, currentStep, steps.length, onComplete]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.iconWrapper}>
                    <span className="material-icons-round text-3xl">insights</span>
                </div>

                <h2 className={styles.title}>Analyzing Resume</h2>
                <p className={styles.subtitle}>Our AI is meticulously reviewing your credentials</p>

                <div className={styles.timeline}>
                    {steps.map((step, index) => {
                        const isCompleted = index < currentStep;
                        const isActive = index === currentStep;

                        return (
                            <div
                                key={index}
                                className={`${styles.step} ${isCompleted ? styles.stepCompleted : ''} ${isActive ? styles.stepActive : ''}`}
                            >
                                <div className={styles.stepIcon}>
                                    {isCompleted ? (
                                        <span className="material-icons-round text-sm">check</span>
                                    ) : isActive ? (
                                        <span className={`material-icons-round text-sm ${styles.spinner}`}>refresh</span>
                                    ) : (
                                        <span className="block w-2 h-2 rounded-full bg-current opacity-20"></span>
                                    )}
                                </div>
                                <div className={styles.stepContent}>
                                    <h4 className={styles.stepTitle}>{step.title}</h4>
                                    <p className={styles.stepDesc}>{step.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
