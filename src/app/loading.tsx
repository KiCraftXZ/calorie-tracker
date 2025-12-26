import styles from './page.module.css';
import { Card } from '@/components/ui/Card';

export default function Loading() {
    return (
        <div className={styles.main}>
            <div className={styles.dashboard}>
                {/* Top Bar Skeleton */}
                <div className={styles.topBar}>
                    <div style={{ width: 44, height: 44, background: '#e0e0e0', borderRadius: '50%' }} />
                    <div className={styles.topActions} style={{ opacity: 0.5 }}>
                        <div className={styles.iconBtn} />
                        <div className={styles.iconBtn} />
                    </div>
                </div>

                {/* Date Nav Skeleton */}
                <div style={{ width: 200, height: 40, background: '#e0e0e0', borderRadius: 99, margin: '0 auto 1rem' }} />

                {/* Header Skeleton */}
                <div className={styles.header} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 120, height: 32, background: '#e0e0e0', borderRadius: 8 }} />
                    <div style={{ width: 80, height: 20, background: '#f0f0f0', borderRadius: 4 }} />
                </div>

                {/* Progress Card Skeleton */}
                <Card className={`${styles.summaryCard} card`} style={{ height: 260 }}>
                    <div style={{ width: 180, height: 180, borderRadius: '50%', border: '4px solid #f0f0f0' }} />
                </Card>

                {/* List Skeleton */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ height: 80, background: 'white', borderRadius: 16, opacity: 0.6 }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
