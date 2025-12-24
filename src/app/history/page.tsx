import { getAllEntries, getGoal } from '../actions';
import { Card } from '@/components/ui/Card';
import { ChartIcon, CalendarIcon, ArrowLeftIcon, CheckIcon, AlertIcon, UtensilsIcon } from '@/components/ui/Icons';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    const [allEntries, goal] = await Promise.all([getAllEntries(), getGoal()]);

    const grouped = allEntries.reduce((acc, entry) => {
        const date = new Date(entry.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        if (!acc[date]) acc[date] = [];
        acc[date].push(entry);
        return acc;
    }, {} as Record<string, typeof allEntries>);

    return (
        <main style={{
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-primary)'
                    }}>
                        <ChartIcon size={22} />
                        History
                    </h1>
                    <Link href="/" style={{
                        color: 'var(--text-muted)',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <ArrowLeftIcon size={16} />
                        Back
                    </Link>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.entries(grouped).map(([date, entries]) => {
                        const total = entries.reduce((s, e) => s + e.calories, 0);
                        const isOver = total > goal;

                        return (
                            <Card key={date} className="card" style={{ overflow: 'hidden' }}>
                                <div style={{
                                    padding: '0.875rem 1rem',
                                    background: 'var(--bg-tertiary)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: '1px solid var(--card-border)'
                                }}>
                                    <span style={{
                                        fontWeight: 500,
                                        color: 'var(--text-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.875rem'
                                    }}>
                                        <CalendarIcon size={14} />
                                        {date}
                                    </span>
                                    <span style={{
                                        color: isOver ? 'var(--warning)' : 'var(--success)',
                                        fontWeight: 500,
                                        fontSize: '0.8125rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem'
                                    }}>
                                        {isOver ? <AlertIcon size={14} /> : <CheckIcon size={14} />}
                                        {total} / {goal}
                                    </span>
                                </div>
                                <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {entries.map(e => (
                                        <div key={e.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '0.875rem',
                                            padding: '0.375rem 0'
                                        }}>
                                            <span style={{
                                                color: 'var(--text-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontWeight: 400
                                            }}>
                                                <UtensilsIcon size={14} color="var(--text-light)" />
                                                {e.name}
                                            </span>
                                            <span style={{
                                                color: 'var(--text-secondary)',
                                                fontWeight: 500
                                            }}>
                                                {e.calories}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        );
                    })}

                    {Object.keys(grouped).length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            padding: '3rem 2rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px dashed var(--warm-300)',
                        }}>
                            <UtensilsIcon size={32} color="var(--warm-400)" />
                            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>No history yet</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
