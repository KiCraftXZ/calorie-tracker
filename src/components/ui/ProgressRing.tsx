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

    // Determine Color Temperature
    let color = '#4F5D48'; // Cool Olive (default)

    if (progress > 100) {
        color = '#9A3A3A'; // Magma (Overfill)
    } else if (progress > 80) {
        color = '#CB6E58'; // Hot Clay
    } else if (progress > 50) {
        color = '#C07A55'; // Warm Terracotta
    } else if (progress > 25) {
        color = '#A5A58D'; // Neutral Olive
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
