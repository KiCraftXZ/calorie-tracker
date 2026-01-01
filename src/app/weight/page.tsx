import { getProfileDetails, getWeightHistory } from '../actions';
import { WeightChart } from '@/components/WeightChart';
import { WeightEntryForm } from '@/components/WeightEntryForm';
import { ArrowLeftIcon, ScaleIcon } from '@/components/ui/Icons';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function WeightPage() {
    const [profile, history] = await Promise.all([
        getProfileDetails(),
        getWeightHistory()
    ]);

    const currentWeight = history.length > 0 ? history[0].weight : profile.current_weight;
    const startWeight = history.length > 0 ? history[history.length - 1].weight : currentWeight;
    const change = currentWeight && startWeight ? (currentWeight - startWeight).toFixed(1) : '0.0';
    const isLoss = parseFloat(change) < 0;

    return (
        <main style={{
            padding: '1.5rem 1rem',
            maxWidth: '600px',
            margin: '0 auto',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/" style={{ color: 'var(--text-primary)' }}>
                    <ArrowLeftIcon size={24} />
                </Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Weight Tracker</h1>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Card style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Current</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {currentWeight || '--'} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)' }}>kg</span>
                    </div>
                </Card>
                <Card style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Goal</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {profile.target_weight || '--'} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)' }}>kg</span>
                    </div>
                </Card>
            </div>

            {/* Chart Section */}
            <section>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Progress</h2>
                    <div style={{ fontSize: '0.875rem', color: isLoss ? '#4F5D48' : '#C07A55', fontWeight: 600 }}>
                        {parseFloat(change) > 0 ? '+' : ''}{change} kg
                    </div>
                </div>
                <Card style={{ padding: '1rem', height: '300px' }}>
                    <WeightChart data={history} targetWeight={profile.target_weight} />
                </Card>
            </section>

            {/* Add Entry Section */}
            <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1rem 0' }}>Log Weight</h2>
                <WeightEntryForm />
            </section>

            {/* History List */}
            <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1rem 0' }}>History</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {history.map((entry) => (
                        <Card key={entry.id} style={{
                            padding: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>{entry.weight} kg</div>
                                <div style={{
                                    fontSize: '0.8125rem',
                                    color: 'var(--text-muted)',
                                    fontFamily: 'var(--font-inter), sans-serif',
                                    fontWeight: 500,
                                    letterSpacing: '0.02em'
                                }}>
                                    {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                            <div style={{ color: 'var(--text-muted)' }}>
                                {/* Optional: Add delete button here if needed */}
                            </div>
                        </Card>
                    ))}
                    {history.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                            No entries yet.
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
