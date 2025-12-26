'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ArrowLeftIcon } from './ui/Icons';
import styles from './DateNavigator.module.css';

interface Props {
    date: string; // YYYY-MM-DD
}

export function DateNavigator({ date }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const currentDate = new Date(date);
    const today = new Date();
    const isToday = currentDate.toDateString() === today.toDateString();

    const handlePrev = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 1);
        const prevStr = prev.toLocaleDateString('en-CA');
        startTransition(() => {
            router.push(`/?date=${prevStr}`);
        });
    };

    const handleNext = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        const nextStr = next.toLocaleDateString('en-CA');
        startTransition(() => {
            router.push(`/?date=${nextStr}`);
        });
    };

    // Format Display
    let displayDate;
    if (isToday) displayDate = "Today";
    else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (currentDate.toDateString() === yesterday.toDateString()) {
            displayDate = "Yesterday";
        } else {
            displayDate = currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }
    }

    return (
        <div className={`${styles.container} ${isPending ? styles.pending : ''}`}>
            <button onClick={handlePrev} className={styles.arrowBtn} aria-label="Previous day" disabled={isPending}>
                <ArrowLeftIcon size={18} />
            </button>

            <div className={styles.dateLabel}>
                {isPending ? '...' : displayDate}
            </div>

            <button
                onClick={handleNext}
                className={styles.arrowBtn}
                disabled={isToday || isPending}
                aria-label="Next day"
                style={{ opacity: isToday ? 0 : 1, pointerEvents: isToday ? 'none' : 'auto' }}
            >
                <ArrowLeftIcon size={18} className={styles.nextIcon} />
            </button>
        </div>
    );
}
