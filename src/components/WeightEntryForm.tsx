'use client';

import { addWeightEntry } from '@/app/actions';
import { useState } from 'react';
import { PlusIcon } from './ui/Icons';

export function WeightEntryForm() {
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addWeightEntry(parseFloat(weight), date);
            setWeight('');
        } catch (error) {
            console.error('Failed to add weight entry:', error);
            alert('Failed to add entry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'end',
            marginBottom: '1rem',
            background: 'white',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-light, #eee)'
        }}>
            <div style={{ flex: 1 }}>
                <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.25rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>Weight (kg)</label>
                <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        outline: 'none',
                        background: '#fafafa',
                        fontFamily: 'var(--font-inter), sans-serif',
                        color: 'var(--text-primary)'
                    }}
                    placeholder="0.0"
                />
            </div>
            <div style={{ width: '130px' }}>
                <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.25rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #ddd',
                        fontSize: '0.9rem',
                        outline: 'none',
                        background: '#fafafa',
                        fontFamily: 'var(--font-inter), sans-serif',
                        color: 'var(--text-primary)',
                        fontWeight: 500
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                style={{
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    width: '3rem',
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    flexShrink: 0
                }}
            >
                <PlusIcon size={24} />
            </button>
        </form>
    );
}
