'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addEntry } from '@/app/actions';
import { Card } from '@/components/ui/Card';
import { PlusIcon, CheckIcon } from '@/components/ui/Icons';
import styles from './IdeaCard.module.css';
import Image from 'next/image';
import confetti from 'canvas-confetti';

interface Props {
    name: string;
    calories: number;
    image: string;
    description?: string;
}

export function IdeaCard({ name, calories, image, description }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    async function handleAdd() {
        if (status === 'success' || isPending) return;

        setStatus('success');

        // Confetti effect from the button
        const btn = document.getElementById(`add-btn-${name.replace(/\s/g, '')}`);
        if (btn) {
            const rect = btn.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;
            confetti({
                particleCount: 50,
                spread: 40,
                origin: { x, y },
                colors: ['#4F5D48', '#8A9A81']
            });
        }

        // Construct FormData
        const formData = new FormData();
        formData.append('name', name);
        formData.append('calories', calories.toString());
        formData.append('date', new Date().toLocaleDateString('en-CA')); // Add to TODAY

        startTransition(async () => {
            await addEntry(formData);
            router.refresh(); // Update server state (optimistic update handled if we were on dashboard, but here we just confirm)
            setTimeout(() => setStatus('idle'), 2000);
        });
    }

    return (
        <Card className={`${styles.card} card`}>
            <div className={styles.imageWrapper}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.overlay} />
                <div className={styles.badge}>{calories} kcal</div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{name}</h3>
                {description && <p className={styles.desc}>{description}</p>}

                <button
                    id={`add-btn-${name.replace(/\s/g, '')}`}
                    onClick={handleAdd}
                    className={`${styles.button} ${status === 'success' ? styles.success : ''}`}
                    disabled={status === 'success' || isPending}
                >
                    {status === 'success' ? (
                        <>
                            <CheckIcon size={18} />
                            <span>Added</span>
                        </>
                    ) : (
                        <>
                            <PlusIcon size={18} />
                            <span>Quick Add</span>
                        </>
                    )}
                </button>
            </div>
        </Card>
    );
}
