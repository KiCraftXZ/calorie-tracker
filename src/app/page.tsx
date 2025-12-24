import {
  getTodayEntries,
  getGoal,
  deleteEntry,
  getProfiles,
  createProfile,
  renameProfile, // Added
  getWeaklyData
} from './actions';
import { cookies } from 'next/headers';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { FoodForm } from '@/components/FoodForm';
import { ProfileMenu } from '@/components/ProfileMenu';
import { CalorieChart } from '@/components/CalorieChart';
import { PlusIcon, TrashIcon, SettingsIcon, UtensilsIcon, LeafIcon } from '@/components/ui/Icons';
import styles from './page.module.css';
import Link from 'next/link';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cookieStore = await cookies();
  const activeProfileId = parseInt(cookieStore.get('active_profile_id')?.value || '1');

  const [entries, goal, profiles, weeklyData] = await Promise.all([
    getTodayEntries(),
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
          <Link href="/settings" className={styles.settingsBtn}>
            <SettingsIcon size={20} />
          </Link>
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
            radius={100}
            stroke={8}
          />
        </Card>

        {/* Weekly Graph */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>Overview</div>
          </div>
          <Card className={`${styles.graphCard} card`}>
            <CalorieChart data={weeklyData} goal={goal} />
          </Card>
        </section>

        {/* Quick Add */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>Quick Add</div>
          </div>
          <Card className={`${styles.formCard} card`}>
            <FoodForm />
          </Card>
        </section>

        {/* Today's Log */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>Today</div>
            <Link href="/history" className={styles.link}>
              View History
            </Link>
          </div>

          <div className={styles.list}>
            {entries.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>No entries yet</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className={styles.entryItem}>
                  <div className={styles.entryLeft}>
                    <div className={styles.entryInfo}>
                      <span className={styles.entryName}>{entry.name}</span>
                    </div>
                  </div>
                  <div className={styles.entryRight}>
                    <div className={styles.entryCals}>
                      <span className={styles.calValue}>{entry.calories}</span>
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
