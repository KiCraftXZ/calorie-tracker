'use client';

import { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { SettingsIcon, UserIcon, PlusIcon, CheckIcon } from './ui/Icons';
import styles from './ProfileMenu.module.css';

interface Profile {
    id: number;
    name: string;
    avatar_color: string;
}

interface Props {
    profiles: Profile[];
    createProfile: (name: string) => Promise<void>;
    activeId: number;
}

export function ProfileMenu({ profiles, createProfile, activeId }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsAdding(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSwitch = (id: number) => {
        Cookies.set('active_profile_id', id.toString());
        router.refresh(); // Refresh to load new profile data
        setIsOpen(false);
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        if (name) {
            await createProfile(name);
            setIsAdding(false);
            // Determine new ID (simplified) or just refesh
            router.refresh();
        }
    };

    return (
        <div className={styles.container} ref={menuRef}>
            <button
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
            >
                <div className={styles.bar} />
                <div className={styles.bar} />
                <div className={styles.bar} />
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <span className={styles.title}>Profiles</span>
                    </div>

                    <div className={styles.list}>
                        {profiles.map(p => (
                            <button
                                key={p.id}
                                className={`${styles.item} ${p.id === activeId ? styles.active : ''}`}
                                onClick={() => handleSwitch(p.id)}
                            >
                                <div
                                    className={styles.avatar}
                                    style={{ background: p.avatar_color || '#ccc' }}
                                >
                                    {p.name[0].toUpperCase()}
                                </div>
                                <span className={styles.name}>{p.name}</span>
                                {p.id === activeId && <CheckIcon size={16} className={styles.check} />}
                            </button>
                        ))}
                    </div>

                    {isAdding ? (
                        <form onSubmit={handleCreate} className={styles.addForm}>
                            <input
                                name="name"
                                placeholder="Name..."
                                autoFocus
                                className={styles.input}
                                maxLength={10}
                            />
                            <button type="submit" className={styles.addBtn}>Add</button>
                        </form>
                    ) : (
                        <button
                            className={styles.createBtn}
                            onClick={() => setIsAdding(true)}
                        >
                            <PlusIcon size={16} />
                            Add Profile
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
