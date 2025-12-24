import { getGoal, updateGoal } from '../actions';
import { Card } from '@/components/ui/Card';
import { SettingsIcon, TargetIcon, FlameIcon, SaveIcon, ArrowLeftIcon } from '@/components/ui/Icons';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const goal = await getGoal();

    return (
        <main style={{
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
        }}>
            <div style={{ width: '100%', maxWidth: '380px' }}>
                <h1 style={{
                    marginBottom: '1.5rem',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-primary)'
                }}>
                    <SettingsIcon size={22} />
                    Settings
                </h1>

                <Card className="card" style={{ padding: '1.5rem' }}>
                    <form action={async (formData) => {
                        'use server';
                        const newGoal = parseInt(formData.get('goal') as string);
                        await updateGoal(newGoal);
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    <TargetIcon size={14} />
                                    Daily Calorie Goal
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-light)'
                                    }}>
                                        <FlameIcon size={18} />
                                    </div>
                                    <input
                                        name="goal"
                                        type="number"
                                        defaultValue={goal}
                                        style={{
                                            background: 'var(--bg-tertiary)',
                                            border: '1px solid var(--card-border)',
                                            padding: '0.875rem 1rem 0.875rem 2.75rem',
                                            borderRadius: 'var(--radius-md)',
                                            color: 'var(--text-primary)',
                                            fontSize: '1rem',
                                            width: '100%',
                                            fontWeight: 500,
                                            outline: 'none',
                                        }}
                                    />
                                </div>
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-light)',
                                    marginTop: '0.25rem'
                                }}>
                                    Recommended: 1,800 – 2,500 kcal/day
                                </p>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    background: 'var(--primary)',
                                    border: 'none',
                                    padding: '0.875rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'white',
                                    fontWeight: 500,
                                    marginTop: '0.5rem',
                                    cursor: 'pointer',
                                    fontSize: '0.9375rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <SaveIcon size={18} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </Card>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link href="/" style={{
                        color: 'var(--text-muted)',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem'
                    }}>
                        <ArrowLeftIcon size={16} />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}
