'use client';

import React, { useRef } from 'react';
import { addEntry } from '@/app/actions';
import styles from './FoodForm.module.css';
import { UtensilsIcon, FlameIcon, PlusIcon } from './ui/Icons';

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
            <div className={styles.inputGroup}>
                <label className={styles.label}>
                    <UtensilsIcon size={14} className={styles.labelIcon} />
                    Food name
                </label>
                <input
                    name="name"
                    placeholder="e.g., Grilled Chicken Salad"
                    className={styles.input}
                    required
                    autoComplete="off"
                />
            </div>
            <div className={styles.inputGroup}>
                <label className={styles.label}>
                    <FlameIcon size={14} className={styles.labelIcon} />
                    Calories
                </label>
                <input
                    name="calories"
                    type="number"
                    placeholder="e.g., 350"
                    className={styles.input}
                    required
                    min="0"
                    step="1"
                />
            </div>
            <button type="submit" className={styles.button}>
                <PlusIcon size={18} className={styles.buttonIcon} />
                Add Entry
            </button>
        </form>
    );
}
