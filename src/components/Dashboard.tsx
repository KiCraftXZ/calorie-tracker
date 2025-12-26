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

    // Dynamic Greeting & Celebration
    useEffect(() => {
        const hour = new Date().getHours();
        let greet = 'Hello';
        if (hour < 12) greet = 'Good Morning';
        else if (hour < 18) greet = 'Good Afternoon';
        else greet = 'Good Evening';

        // Combine with name
        if (progress >= 100) {
            greet = `Goal Crushed, ${profileName}! 🎉`;
            // Random burst logic
            if (Math.random() > 0.8) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#4F5D48', '#8A9A81', '#E6C288', '#C07A55']
                });
            }
        } else {
            greet = `${greet}, ${profileName}`;
        }

        setGreeting(greet);
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
                colors: ['#4F5D48', '#8A9A81', '#E6C288', '#C07A55']
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

    // Fallback greeting during SSR/Hydration to prevent flicker
    const displayGreeting = greeting || `Hello, ${profileName}`;

    return (
        <>
            <header className={`${styles.header} animate-enter`}>
                <h1 className={styles.title}>{displayGreeting}</h1>
            </header>

            {/* Progress Card */}
            <Card className={`${styles.summaryCard} card animate-enter`} style={{ animationDelay: '0.1s' }}>
                <ProgressRing
                    progress={progress}
                    goal={goal}
                    current={totalCalories}
                    radius={110}
                    stroke={4}
                />
            </Card>

            {/* Quick Add */}
            <section className={`${styles.section} animate-enter`} style={{ animationDelay: '0.2s' }}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>Add Food</div>
                </div>
                <Card className={`${styles.formCard} card`}>
                    <FoodForm date={date} onSubmit={handleAddEntry} />
                </Card>
            </section>

            {/* Today's Log */}
            <section className={`${styles.section} animate-enter`} style={{ animationDelay: '0.3s' }}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>Log</div>
                </div>

                <div className={styles.list}>
                    {optimisticEntries.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText}>Ready to fuel your day? 🌱</p>
                        </div>
                    ) : (
                        optimisticEntries.map((entry, index) => (
                            <div
                                key={entry.id}
                                className={`${styles.entryItem} animate-enter`}
                                style={{ animationDelay: `${0.4 + (index * 0.05)}s` }} // Staggered delay
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
