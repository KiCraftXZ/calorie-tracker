import { getProfileDetails } from '../actions';
import { Card } from '@/components/ui/Card';
import { SettingsIcon, ArrowLeftIcon } from '@/components/ui/Icons';
import Link from 'next/link';
import ProfileForm from '@/components/settings/ProfileForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const profile = await getProfileDetails();

    return (
        <main style={{
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'var(--bg-primary)'
        }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <h1 style={{
                    marginBottom: '2rem',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--text-primary)'
                }}>
                    <SettingsIcon size={28} />
                    Settings
                </h1>

                <Card className="card" style={{ padding: '2rem' }}>
                    <ProfileForm profile={profile} />
                </Card>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <Link href="/" style={{
                        color: 'var(--text-primary)', // High Contrast
                        fontWeight: 700,
                        fontSize: '1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem 1.75rem', // Larger touch target
                        borderRadius: 'var(--radius-md)',
                        background: 'white',
                        border: '2px solid var(--card-border)', // Thicker border
                        boxShadow: 'var(--card-shadow)',
                        transition: 'transform 0.1s ease',
                        fontFamily: 'Inter, sans-serif'
                    }}>
                        <ArrowLeftIcon size={20} />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}
