'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addEntry } from '@/app/actions';
import { Card } from '@/components/ui/Card';
import { PlusIcon, CheckIcon, ChevronDown } from '@/components/ui/Icons'; // Assuming ChevronDown exists or I'll add it
import styles from './IdeaCard.module.css';
import Image from 'next/image';
import confetti from 'canvas-confetti';

interface Props {
    name: string;
    calories: number;
    protein: number;
    ingredients: string[];
    image: string;
    description?: string;
}

export function IdeaCard({ name, calories, protein, ingredients, image, description }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<'idle' | 'success'>('idle');
    const [isOpen, setIsOpen] = useState(false);

    async function handleAdd(e: React.MouseEvent) {
        e.stopPropagation(); // Prevent card toggle
        if (status === 'success' || isPending) return;

        setStatus('success');

        // Confetti effect
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
        formData.append('date', new Date().toLocaleDateString('en-CA'));

        startTransition(async () => {
            await addEntry(formData);
            router.refresh();
            setTimeout(() => setStatus('idle'), 2000);
        });
    }

    return (
        <Card
            className={`${styles.card} card ${isOpen ? styles.open : ''}`}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className={styles.imageWrapper}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.overlay} />
                <div className={styles.badges}>
                    <div className={styles.badge}>{calories} kcal</div>
                    <div className={`${styles.badge} ${styles.proteinBadge}`}>{protein}g Protein</div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{name}</h3>
                    <ChevronDown size={20} className={`${styles.chevron} ${isOpen ? styles.rotate : ''}`} />
                </div>

                {description && <p className={styles.desc}>{description}</p>}

                {/* Expandable Ingredients Section */}
                <div className={`${styles.details} ${isOpen ? styles.show : ''}`}>
                    <div className={styles.divider} />
                    <h4 className={styles.ingredientsTitle}>Ingredients</h4>
                    <ul className={styles.ingredientsList}>
                        {ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                        ))}
                    </ul>
                </div>

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
