import {
  getEntries,
  getGoal,
  deleteEntry,
  getProfiles,
  createProfile,
  renameProfile,
  getWeaklyData
} from './actions';
import { cookies } from 'next/headers';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { FoodForm } from '@/components/FoodForm';
import { ProfileMenu } from '@/components/ProfileMenu';
import { CalorieChart } from '@/components/CalorieChart';
import { DateNavigator } from '@/components/DateNavigator'; // New
import { TrashIcon, SettingsIcon, ChartIcon, CalendarIcon } from '@/components/ui/Icons';
import styles from './page.module.css';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { date?: string }; // YYYY-MM-DD
}

export default async function Home({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const activeProfileId = parseInt(cookieStore.get('active_profile_id')?.value || '1');

  // Use search param date or default to today (client-side default handled in DateNavigator, but server needs one too)
  // Actually, getEntries handles undefined date => Today.
  // But for display, we want consistent handling.
  const dateParam = (await searchParams).date;
  const targetDate = dateParam || new Date().toLocaleDateString('en-CA');

  const [entries, goal, profiles, weeklyData] = await Promise.all([
    getEntries(targetDate), // Changed from getTodayEntries
    getGoal(),
    getProfiles(),
    getWeaklyData()
  ]);

  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const progress = (totalCalories / goal) * 100;

  return (
    <main className={styles.main}>
      <div className={styles.dashboard}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <ProfileMenu
            profiles={profiles}
            createProfile={createProfile}
            renameProfile={renameProfile}
            activeId={activeProfileId}
          />
          <div className={styles.topActions}>
            <Link href="/overview" className={styles.iconBtn} aria-label="Overview">
              <ChartIcon size={20} />
            </Link>
            <Link href="/settings" className={styles.iconBtn} aria-label="Settings">
              <SettingsIcon size={20} />
            </Link>
          </div>
        </div>

        {/* Date Navigation */}
        <div className={styles.dateNavWrapper}>
          <DateNavigator date={targetDate} />
        </div>

        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            {activeProfile?.name || 'Hello'}
          </h1>
          <p className={styles.subtitle}>Daily Progress</p>
        </header>

        {/* Progress Card */}
        <Card className={`${styles.summaryCard} card`}>
          <ProgressRing
            progress={progress}
            goal={goal}
            current={totalCalories}
            radius={110}
            stroke={4}
          />
        </Card>

        {/* Quick Add */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>Add Food</div>
          </div>
          <Card className={`${styles.formCard} card`}>
            <FoodForm date={targetDate} />
          </Card>
        </section>

        {/* Today's Log */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>Log</div>
          </div>

          <div className={styles.list}>
            {entries.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>No entries for this day</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className={styles.entryItem}>
                  <div className={styles.entryLeft}>
                    <div className={styles.entryInfo}>
                      <span className={styles.entryName}>{entry.name}</span>
                      <span className={styles.entryTime}>
                        {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className={styles.entryRight}>
                    <div className={styles.entryCals}>
                      <span className={styles.calValue}>{entry.calories}</span>
                      <span className={styles.calLabel}>kcal</span>
                    </div>
                    <form action={async () => {
                      'use server';
                      await deleteEntry(entry.id);
                    }}>
                      <button type="submit" className={styles.deleteBtn}>
                        <TrashIcon size={16} />
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
