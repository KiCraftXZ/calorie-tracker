'use client';

import React from 'react';
import styles from './ProgressRing.module.css';

interface ProgressRingProps {
    radius?: number;
    stroke?: number;
    progress: number;
    goal: number;
    current: number;
}

export function ProgressRing({
    radius = 100,
    stroke = 6,
    progress,
    goal,
    current
}: ProgressRingProps) {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const visualProgress = Math.min(Math.max(progress, 0), 100);
    const strokeDashoffset = circumference - (visualProgress / 100) * circumference;

    return (
        <div className={styles.container}>
            <svg
                height={radius * 2}
                width={radius * 2}
                className={styles.ring}
            >
                <circle
                    className={styles.circleBg}
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    className={styles.circleProgress}
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className={styles.content}>
                <span className={styles.value}>{current}</span>
                <span className={styles.sub}>
                    / {goal} kcal
                </span>
            </div>
        </div>
    );
}
