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
    radius = 110,
    stroke = 4,
    progress,
    goal,
    current
}: ProgressRingProps) {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const visualProgress = Math.min(Math.max(progress, 0), 100);
    const strokeDashoffset = circumference - (visualProgress / 100) * circumference;

    // Organic Growth Palette (0-25-50-75-100)
    let color = '#A5A58D'; // < 25%: Soil/Neutral (Sage)

    if (progress >= 100) {
        color = '#2E5936'; // 100%+: Lush Forest Green
    } else if (progress >= 75) {
        color = '#4F5D48'; // 75-99%: Deep Olive (Primary)
    } else if (progress >= 50) {
        color = '#6A8A4F'; // 50-74%: Fresh Green
    } else if (progress >= 25) {
        color = '#8A9A81'; // 25-49%: Sprout (Light Olive)
    }

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
                    style={{ strokeDashoffset, stroke: color }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className={styles.content}>
                <span className={styles.value} style={{ color }}>{current}</span>
                <span className={styles.sub}>{goal} Goal</span>
            </div>
        </div>
    );
}
