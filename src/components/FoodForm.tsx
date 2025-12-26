'use client';

import React, { useRef, useState } from 'react';
import styles from './FoodForm.module.css';
import { PlusIcon, CheckIcon } from './ui/Icons';

interface Props {
    date?: string;
    onSubmit: (formData: FormData) => Promise<void>;
}

export function FoodForm({ date, onSubmit }: Props) {
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
        <form ref={ref} action={handleSubmit} className={styles.form}>
            {date && <input type="hidden" name="date" value={date} />}

            <div className={styles.inputGroup} style={{ flex: 2 }}>
                <input
                    name="name"
                    placeholder="Food name..."
                    className={styles.input}
                    required
                    autoComplete="off"
                />
            </div>
            <div className={styles.inputGroup} style={{ flex: 1 }}>
                <input
                    name="calories"
                    type="number"
                    placeholder="Kcal"
                    className={styles.input}
                    required
                    min="0"
                    step="1"
                />
            </div>
            <button
                type="submit"
                className={`${styles.button} ${status === 'success' ? styles.success : ''}`}
                aria-label="Add"
                disabled={status === 'success'}
            >
                {status === 'success' ? (
                    <CheckIcon size={24} className={styles.checkIcon} />
                ) : (
                    <PlusIcon size={24} />
                )}
            </button>
        </form>
    );
}
