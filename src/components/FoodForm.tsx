'use client';

import React, { useRef, useState } from 'react';
import styles from './FoodForm.module.css';
import { PlusIcon, CheckIcon } from './ui/Icons';

interface Props {
    date?: string;
    onSubmit: (formData: FormData) => Promise<void>;
    isHero?: boolean;
}

export function FoodForm({ date, onSubmit, isHero = false }: Props) {
    const ref = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    async function handleSubmit(formData: FormData) {
        const name = formData.get('name');
        const calories = formData.get('calories');

        if (!name || !calories) return;

        // Instant reset + animation
        ref.current?.reset();
        setStatus('success');
        setTimeout(() => setStatus('idle'), 1500);

        // Fire-and-forget to parent (optimistic update happens there)
        await onSubmit(formData);
    }

    return (
        <form ref={ref} action={handleSubmit} className={`${styles.form} ${isHero ? styles.heroForm : ''}`}>
            {date && <input type="hidden" name="date" value={date} />}

            <div className={styles.inputGroup} style={{ flex: 2 }}>
                <input
                    name="name"
                    placeholder="What did you eat?"
                    className={`${styles.input} ${isHero ? styles.heroInput : ''}`}
                    required
                    autoComplete="off"
                />
            </div>
            <div className={styles.inputGroup} style={{ flex: 1 }}>
                <input
                    name="calories"
                    type="number"
                    placeholder="Kcal"
                    className={`${styles.input} ${isHero ? styles.heroInput : ''}`}
                    required
                    min="0"
                    step="1"
                />
            </div>
            <button
                type="submit"
                className={`${styles.button} ${isHero ? styles.heroButton : ''} ${status === 'success' ? styles.success : ''}`}
                aria-label="Add"
                disabled={status === 'success'}
            >
                {status === 'success' ? (
                    <CheckIcon size={24} className={styles.checkIcon} />
                ) : (
                    <PlusIcon size={24} color={isHero ? '#1A2E1A' : 'currentColor'} />
                )}
            </button>
        </form>
    );
}
