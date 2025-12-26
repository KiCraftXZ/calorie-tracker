import styles from './page.module.css';
import { IdeaCard } from '@/components/IdeaCard';
import { ArrowLeftIcon } from '@/components/ui/Icons';
import Link from 'next/link';

// Curated List with Local AI-Generated Images & Instructions
const IDEAS = [
    {
        name: 'PB Power Smoothie',
        calories: 600,
        protein: 24,
        description: 'Banana, peanut butter, oats, and milk blended to perfection.',
        image: '/pb_power_smoothie.png',
        ingredients: [
            '2 tbsp Peanut Butter',
            '1 large Banana',
            '1/2 cup Rolled Oats',
            '1 cup Whole Milk',
            '1 tsp Honey'
        ]
    },
    {
        name: 'Avocado Super Toast',
        calories: 450,
        protein: 18,
        description: 'Sourdough topped with smashed avocado, poached egg, and seeds.',
        image: '/avocado_super_toast.png',
        ingredients: [
            '2 slices Sourdough Bread',
            '1/2 ripe Avocado',
            '2 large Eggs (Poached)',
            '1 tbsp Hemp Seeds',
            'Chili Flakes & Sea Salt'
        ]
    },
    {
        name: 'Trail Mix Bowl',
        calories: 500,
        protein: 14,
        description: 'A nutrient-dense mix of nuts, dark chocolate, and dried fruit.',
        image: '/trail_mix_bowl.png',
        ingredients: [
            '1/3 cup Almonds',
            '1/4 cup Walnuts',
            '2 tbsp Dark Chocolate Chips',
            '2 tbsp Dried Cranberries',
            '1 tbsp Pumpkin Seeds'
        ]
    },
    {
        name: 'Greek Logic Parfait',
        calories: 350,
        protein: 22,
        description: 'Full-fat greek yogurt layered with honey, golden granola, and fresh berries.',
        image: '/greek_yogurt_parfait.png',
        ingredients: [
            '1 cup Greek Yogurt (Full Fat)',
            '1/4 cup Granola',
            '1 tbsp Honey',
            '1/2 cup Mixed Berries'
        ]
    },
    {
        name: "Overnight Oats",
        calories: 400,
        protein: 16,
        description: "Rolled oats soaked in almond milk with chia seeds and berries.",
        image: "/overnight_oats.png",
        ingredients: [
            '1/2 cup Rolled Oats',
            '1 tbsp Chia Seeds',
            '3/4 cup Almond Milk',
            '1 tsp Maple Syrup',
            'Fresh Blueberries'
        ]
    },
    {
        name: "Hummus & Pita Plate",
        calories: 420,
        protein: 12,
        description: "Creamy hummus with olive oil, chickpeas and warm pita bread.",
        image: "/hummus_pita_plate.png",
        ingredients: [
            '1/2 cup Hummus',
            '1 tbsp Olive Oil',
            '1 Whole Wheat Pita Bread',
            'Spices (Paprika, Cumin)',
            'Cucumber Slices'
        ]
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
