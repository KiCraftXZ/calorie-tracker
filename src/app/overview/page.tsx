import { getWeaklyData } from '../actions';
import { Card } from '@/components/ui/Card';
import { CalorieChart } from '@/components/CalorieChart';
import { TrendChart } from '@/components/TrendChart';
import { ArrowLeftIcon } from '@/components/ui/Icons';
import Link from 'next/link';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
    const weeklyData = await getWeaklyData();

    // Calculate trends (simple average)
    const total = weeklyData.reduce((sum, d) => sum + d.total, 0);
    const avg = Math.round(weeklyData.length ? total / weeklyData.length : 0);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Link href="/" className={styles.backBtn}>
                        <ArrowLeftIcon size={24} />
                    </Link>
                    <h1 className={styles.title}>Overview</h1>
                    <div style={{ width: 40 }} /> {/* Spacer */}
                </div>

                <section className={styles.section}>
                    <div className={styles.statGrid}>
                        <Card className={styles.statCard}>
                            <div className={styles.statLabel}>30 Day Avg</div>
                            <div className={styles.statValue}>{avg}</div>
                        </Card>
                        <Card className={styles.statCard}>
                            <div className={styles.statLabel}>Total Saved</div>
                            <div className={styles.statValue}>{weeklyData.length}</div>
                        </Card>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Activity (30 Days)</h2>
                    </div>
                    <Card className={styles.chartCard} style={{ height: 250 }}>
                        <CalorieChart data={weeklyData} goal={2000} />
                    </Card>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Trend</h2>
                    </div>
                    <Card className={styles.chartCard} style={{ height: 250 }}>
                        <TrendChart data={weeklyData} goal={2000} />
                    </Card>
                </section>
            </div>
        </main>
    );
}
