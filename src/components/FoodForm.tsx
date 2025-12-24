'use client';

import React, { useRef } from 'react';
import { addEntry } from '@/app/actions';
import styles from './FoodForm.module.css';
import { PlusIcon } from './ui/Icons';

export function FoodForm() {
    const ref = useRef<HTMLFormElement>(null);

    async function clientAction(formData: FormData) {
        const name = formData.get('name');
        const calories = formData.get('calories');

        if (!name || !calories) return;

        await addEntry(formData);
        ref.current?.reset();
    }

    return (
        <form ref={ref} action={clientAction} className={styles.form}>
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
            <button type="submit" className={styles.button} aria-label="Add">
                <PlusIcon size={20} />
            </button>
        </form>
    );
}
