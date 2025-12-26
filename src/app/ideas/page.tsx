import styles from './page.module.css';
import { IdeaCard } from '@/components/IdeaCard';
import { ArrowLeftIcon } from '@/components/ui/Icons';
import Link from 'next/link';

// Curated List with Local AI-Generated Images
const IDEAS = [
    {
        name: 'PB Power Smoothie',
        calories: 600,
        description: 'Banana, peanut butter, oats, and milk blended to perfection.',
        image: '/pb_power_smoothie.png'
    },
    {
        name: 'Avocado Super Toast',
        calories: 450,
        description: 'Sourdough topped with smashed avocado, poached egg, and seeds.',
        image: '/avocado_super_toast.png'
    },
    {
        name: 'Trail Mix Bowl',
        calories: 500,
        description: 'A nutrient-dense mix of nuts, dark chocolate, and dried fruit.',
        image: '/trail_mix_bowl.png'
    },
    {
        name: 'Greek Logic Parfait',
        calories: 350,
        description: 'Full-fat greek yogurt layered with honey, golden granola, and fresh berries.',
        image: '/greek_yogurt_parfait.png'
    },
    {
        name: "Overnight Oats",
        calories: 400,
        description: "Rolled oats soaked in almond milk with chia seeds and berries.",
        image: "/overnight_oats.png"
    },
    {
        name: "Hummus & Pita Plate",
        calories: 420,
        description: "Creamy hummus with olive oil, chickpeas and warm pita bread.",
        image: "/hummus_pita_plate.png"
    }
];

export default function IdeasPage() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <Link href="/" className={styles.backBtn} aria-label="Back">
                    <ArrowLeftIcon size={24} />
                </Link>
                <div>
                    <h1 className={styles.title}>Fuel Station</h1>
                    <p className={styles.subtitle}>Quick, high-calorie ideas.</p>
                </div>
            </header>

            <div className={styles.grid}>
                {IDEAS.map((idea) => (
                    <IdeaCard
                        key={idea.name}
                        {...idea}
                    />
                ))}
            </div>
        </main>
    );
}
