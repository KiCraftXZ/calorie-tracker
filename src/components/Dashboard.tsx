'use client';

import React, { useOptimistic, useTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Entry, addEntry, deleteEntry } from '@/app/actions';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { FoodForm } from '@/components/FoodForm';
import { TrashIcon } from '@/components/ui/Icons';
import styles from '@/app/page.module.css';
import confetti from 'canvas-confetti';

interface Props {
    entries: Entry[];
    goal: number;
    date: string;
    profileName: string;
}

type OptimisticAction =
    | { type: 'add'; entry: Entry }
    | { type: 'delete'; id: number };

export function Dashboard({ entries, goal, date, profileName }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [greeting, setGreeting] = useState('');
    const [insight, setInsight] = useState(''); // New "Soul" state

    // Optimistic state
    const [optimisticEntries, dispatchOptimistic] = useOptimistic(
        entries,
        (state, action: OptimisticAction) => {
            if (action.type === 'add') {
                return [action.entry, ...state];
            } else if (action.type === 'delete') {
                return state.filter(e => e.id !== action.id);
            }
            return state;
        }
    );

    const totalCalories = optimisticEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const progress = (totalCalories / goal) * 100;

    // Insight Engine & Dynamic Greeting
    useEffect(() => {
        const hour = new Date().getHours();
        let greet = 'Hello';
        if (hour < 12) greet = 'Good Morning';
        else if (hour < 18) greet = 'Good Afternoon';
        else greet = 'Good Evening';

        // Insight Logic
        let msg = "Let's get this bread. 🥖";
        if (progress === 0) msg = "Fuel the machine. 💪";
        else if (progress < 30) msg = "Good start. Keep building.";
        else if (progress < 60) msg = "Momentum is building... 🔥";
        else if (progress < 90) msg = "Almost there. Finish strong!";
        else if (progress >= 100) msg = "Mission Accomplished. 🚀";

        if (progress >= 100) {
            greet = `Goal Crushed, ${profileName}!`;
        } else {
            greet = `${greet}, ${profileName}`;
        }

        setGreeting(greet);
        setInsight(msg);
    }, [progress, profileName]);

    // Handler for adding entry
    async function handleAddEntry(formData: FormData) {
        const name = formData.get('name') as string;
        const calories = parseInt(formData.get('calories') as string);
        if (!name || isNaN(calories)) return;

        const optimisticEntry: Entry = {
            id: Date.now(),
            name,
            calories,
            created_at: new Date().toISOString(),
        };

        // Check for goal completion on ADD
        if ((totalCalories + calories) / goal >= 1 && progress < 100) {
            confetti({
                particleCount: 150,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#D4E157', '#C07A55', '#E6C288'] // Updated to new Lime accents
            });
        }

        startTransition(async () => {
            dispatchOptimistic({ type: 'add', entry: optimisticEntry });
            await addEntry(formData);
            router.refresh();
        });
    }

    // Handler for deleting entry
    async function handleDeleteEntry(id: number) {
        startTransition(async () => {
            dispatchOptimistic({ type: 'delete', id });
            await deleteEntry(id);
            router.refresh();
        });
    }

    const displayGreeting = greeting || `Hello, ${profileName}`;

    return (
        <>
            <header className={`${styles.header} animate-enter`}>
                <h1 className={styles.title}>{displayGreeting}</h1>
            </header>

            {/* Progress Card - "Breathing" Pulse Effect if progress > 50 */}
            <Card
                className={`${styles.summaryCard} card animate-enter`}
                style={{
                    animationDelay: '0.1s',
                    animation: progress > 0 && progress < 100 ? 'pulse 6s infinite ease-in-out' : undefined
                }}
            >
                <ProgressRing
                    progress={progress}
                    goal={goal}
                    current={totalCalories}
                    radius={110}
                    stroke={10} /* Thicker per V2 */
                />
                <div className={styles.insightText}>{insight}</div>
            </Card>

            {/* Quick Add - HERO SECTION (Dark Mode) */}
            <section className={`${styles.section} animate-enter`} style={{ animationDelay: '0.2s' }}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>Quick Fuel</div>
                </div>
                <Card className={`${styles.heroCard} card`}>
                    <div className={styles.heroGlow} />
                    <div className={styles.heroContent}>
                        <FoodForm date={date} onSubmit={handleAddEntry} isHero={true} />
                    </div>
                </Card>
            </section>

            {/* Today's Log */}
            <section className={`${styles.section} animate-enter`} style={{ animationDelay: '0.3s' }}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>History</div>
                </div>

                <div className={styles.list}>
                    {optimisticEntries.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText}>Nothing logged yet.</p>
                        </div>
                    ) : (
                        optimisticEntries.map((entry) => (
                            <div
                                key={entry.id}
                                className={styles.entryItem}
                            >
                                <div className={styles.entryLeft}>
                                    <div className={styles.entryInfo}>
                                        <span className={styles.entryName}>{entry.name}</span>
                                        <span className={styles.entryTime}>
                                            {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.entryRight}>
                                    <div className={styles.entryCals}>
                                        <span className={styles.calValue}>{entry.calories}</span>
                                        <span className={styles.calLabel}>kcal</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteEntry(entry.id)}
                                    >
                                        <TrashIcon size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </>
    );
}
