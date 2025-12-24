import { getTodayEntries, getGoal, deleteEntry } from './actions';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { FoodForm } from '@/components/FoodForm';
import { LeafIcon, PlusIcon, ClockIcon, TrashIcon, SettingsIcon, UtensilsIcon } from '@/components/ui/Icons';
import styles from './page.module.css';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [entries, goal] = await Promise.all([getTodayEntries(), getGoal()]);

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const progress = (totalCalories / goal) * 100;

  return (
    <main className={styles.main}>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <LeafIcon size={24} className={styles.titleIcon} />
            Calorie
          </h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <Card className={`${styles.summaryCard} card`}>
          <ProgressRing
            progress={progress}
            goal={goal}
            current={totalCalories}
            radius={90}
            stroke={8}
          />
        </Card>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <PlusIcon size={14} className={styles.sectionIcon} />
              Quick Add
            </div>
          </div>
          <Card className={`${styles.formCard} card`}>
            <FoodForm />
          </Card>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <ClockIcon size={14} className={styles.sectionIcon} />
              Today
            </div>
            <Link href="/history" className={styles.link}>
              View all
            </Link>
          </div>

          <div className={styles.list}>
            {entries.length === 0 ? (
              <div className={styles.emptyState}>
                <UtensilsIcon size={32} className={styles.emptyIcon} />
                <p className={styles.emptyText}>No entries yet today</p>
              </div>
            ) : (
              entries.map((entry) => (
                <Card key={entry.id} className={`${styles.entryItem} card`}>
                  <div className={styles.entryLeft}>
                    <div className={styles.entryIcon}>
                      <UtensilsIcon size={18} />
                    </div>
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
                      <span className={styles.calLabel}> kcal</span>
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
                </Card>
              ))
            )}
          </div>
        </section>

        <div className={styles.footer}>
          <Link href="/settings" className={styles.settingsLink}>
            <SettingsIcon size={14} />
            Settings
          </Link>
        </div>
      </div>
    </main>
  );
}
