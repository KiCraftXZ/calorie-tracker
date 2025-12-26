'use client';

import React, { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Entry, addEntry, deleteEntry } from '@/app/actions';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { FoodForm } from '@/components/FoodForm';
import { TrashIcon } from '@/components/ui/Icons';
import styles from '@/app/page.module.css';

interface Props {
    entries: Entry[];
    goal: number;
    date: string;
}

type OptimisticAction =
    | { type: 'add'; entry: Entry }
    | { type: 'delete'; id: number };

export function Dashboard({ entries, goal, date }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Optimistic state for entries (supports add and delete)
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

        startTransition(async () => {
            dispatchOptimistic({ type: 'add', entry: optimisticEntry });
            await addEntry(formData);
            router.refresh();
        });
    }

    // Handler for deleting entry (now optimistic!)
    async function handleDeleteEntry(id: number) {
        startTransition(async () => {
            dispatchOptimistic({ type: 'delete', id });
            await deleteEntry(id);
            router.refresh();
        });
    }

    return (
        <>
            {/* Progress Card */}
            <Card className={`${styles.summaryCard} card`}>
                <ProgressRing
                    progress={progress}
                    goal={goal}
                    current={totalCalories}
                    radius={110}
                    stroke={4}
                />
            </Card>

            {/* Quick Add */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>Add Food</div>
                </div>
                <Card className={`${styles.formCard} card`}>
                    <FoodForm date={date} onSubmit={handleAddEntry} />
                </Card>
            </section>

            {/* Today's Log */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>Log</div>
                </div>

                <div className={styles.list}>
                    {optimisticEntries.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText}>No entries for this day</p>
                        </div>
                    ) : (
                        optimisticEntries.map((entry) => (
                            <div key={entry.id} className={styles.entryItem}>
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
