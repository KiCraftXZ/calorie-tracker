'use client';

import React, { useRef, useState } from 'react';
import { addEntry } from '@/app/actions';
import styles from './FoodForm.module.css';
import { PlusIcon, CheckIcon } from './ui/Icons';
import { useRouter } from 'next/navigation';

interface Props {
    date?: string; // YYYY-MM-DD
}

export function FoodForm({ date }: Props) {
    const ref = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    async function clientAction(formData: FormData) {
        const name = formData.get('name');
        const calories = formData.get('calories');

        if (!name || !calories) return;

        // Optimistic reset
        ref.current?.reset();

        // Trigger Animation
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);

        await addEntry(formData);
        // Explicit refresh to ensure everything syncs (though server action usually handles it)
        router.refresh();
    }

    return (
        <form ref={ref} action={clientAction} className={styles.form}>
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
                    <CheckIcon size={24} className={styles.checkIcon} /> // Size 24 matches PlusIcon
                ) : (
                    <PlusIcon size={24} />
                )}
            </button>
        </form>
    );
}
