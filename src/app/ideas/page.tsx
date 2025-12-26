import styles from './page.module.css';
import { IdeaCard } from '@/components/IdeaCard';
import { ArrowLeftIcon } from '@/components/ui/Icons';
import Link from 'next/link';

// Curated List with High-Quality Unsplash IDs
const IDEAS = [
    {
        name: 'PB Power Smoothie',
        calories: 600,
        description: 'Banana, peanut butter, oats, and milk blended to perfection.',
        image: 'https://images.unsplash.com/photo-1597405490028-282ae514a7e9?auto=format&fit=crop&w=800' // Smooth Texture
    },
    {
        name: 'Avocado Super Toast',
        calories: 450,
        description: 'Sourdough topped with smashed avocado, poached egg, and seeds.',
        image: 'https://images.unsplash.com/photo-1525351478240-5431bfb80d4e?auto=format&fit=crop&w=800' // Avocado Toast
    },
    {
        name: 'Trail Mix Bowl',
        calories: 500,
        description: 'A nutrient-dense mix of nuts, dark chocolate, and dried fruit.',
        image: 'https://images.unsplash.com/photo-1511316695145-299d12a2ee71?auto=format&fit=crop&w=800' // Nuts/Seeds close up
    },
    {
        name: 'Greek Logic Parfait',
        calories: 350,
        description: 'Full-fat greek yogurt layered with honey and crunchy granola.',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&w=800' // Parfait
    },
    {
        name: "Overnight Oats",
        calories: 400,
        description: "Rolled oats soaked in almond milk with chia seeds and berries.",
        image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800"
    },
    {
        name: "Hummus & Pita Plate",
        calories: 420,
        description: "Creamy hummus with olive oil, chickpeas and warm pita bread.",
        image: "https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?auto=format&fit=crop&w=800"
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
