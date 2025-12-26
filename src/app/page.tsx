import {
  getEntries,
  getGoal,
  getProfiles,
  createProfile,
  renameProfile,
} from './actions';
import { cookies } from 'next/headers';
import { ProfileMenu } from '@/components/ProfileMenu';
import { DateNavigator } from '@/components/DateNavigator';
import { Dashboard } from '@/components/Dashboard';
import { SettingsIcon, ChartIcon } from '@/components/ui/Icons';
import styles from './page.module.css';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { date?: string };
}

export default async function Home({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const activeProfileId = parseInt(cookieStore.get('active_profile_id')?.value || '1');

  const dateParam = (await searchParams).date;
  const targetDate = dateParam || new Date().toLocaleDateString('en-CA');

  const [entries, goal, profiles] = await Promise.all([
    getEntries(targetDate),
    getGoal(),
    getProfiles(),
  ]);

  const activeProfile = profiles.find(p => p.id === activeProfileId);

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
            <Link href="/ideas" className={styles.iconBtn} aria-label="Ideas">
              <span style={{ fontSize: '1.25rem' }}>💡</span>
            </Link>
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

        {/* Client-Side Dashboard with Optimistic UI */}
        <Dashboard
          entries={entries}
          goal={goal}
          date={targetDate}
          profileName={activeProfile?.name || 'Friend'}
        />
      </div>
    </main>
  );
}
