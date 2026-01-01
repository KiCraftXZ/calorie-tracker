'use client';

import { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { PlusIcon, CheckIcon, SettingsIcon, UserIcon, ChevronDown, ChevronUp } from './ui/Icons';
import styles from './ProfileMenu.module.css';

interface Profile {
    id: number;
    name: string;
    avatar_color: string;
}

interface Props {
    profiles: Profile[];
    createProfile: (name: string) => Promise<void>;
    renameProfile: (newName: string) => Promise<void>; // Prop needed
    moveProfile: (id: number, direction: 'up' | 'down') => Promise<void>;
    activeId: number;
}

export function ProfileMenu({ profiles, createProfile, renameProfile, moveProfile, activeId }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'list' | 'add' | 'rename'>('list');
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const activeProfile = profiles.find(p => p.id === activeId);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setMode('list');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSwitch = (id: number) => {
        Cookies.set('active_profile_id', id.toString());
        router.refresh();
        setIsOpen(false);
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        if (name) {
            await createProfile(name);
            setMode('list');
            router.refresh();
        }
    };

    const handleRename = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        if (name) {
            await renameProfile(name);
            setMode('list');
            router.refresh();
        }
    }

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

                    {mode === 'list' && (
                        <>
                            <div className={styles.header}>
                                <span className={styles.title}>Profiles</span>
                            </div>

                            <div className={styles.list}>
                                {profiles.map((p, index) => (
                                    <div key={p.id} className={styles.itemWrapper}>
                                        <div className={styles.reorderCol}>
                                            {index > 0 ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); moveProfile(p.id, 'up'); }}
                                                    className={styles.reorderBtn}
                                                    title="Move Up"
                                                >
                                                    <ChevronUp size={12} />
                                                </button>
                                            ) : <div style={{ height: 16 }} />}
                                            {index < profiles.length - 1 ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); moveProfile(p.id, 'down'); }}
                                                    className={styles.reorderBtn}
                                                    title="Move Down"
                                                >
                                                    <ChevronDown size={12} />
                                                </button>
                                            ) : <div style={{ height: 16 }} />}
                                        </div>
                                        <button
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
                                        {p.id === activeId && (
                                            <button onClick={() => setMode('rename')} className={styles.editBtn}>
                                                <SettingsIcon size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                className={styles.createBtn}
                                onClick={() => setMode('add')}
                            >
                                <PlusIcon size={16} />
                                New Profile
                            </button>
                        </>
                    )}

                    {mode === 'add' && (
                        <div className={styles.formContainer}>
                            <div className={styles.header}>New Profile</div>
                            <form onSubmit={handleCreate} className={styles.addForm}>
                                <input
                                    name="name"
                                    placeholder="Name..."
                                    autoFocus
                                    className={styles.input}
                                    maxLength={12}
                                />
                                <button type="submit" className={styles.addBtn}>Add</button>
                            </form>
                            <button onClick={() => setMode('list')} className={styles.backBtn}>Cancel</button>
                        </div>
                    )}

                    {mode === 'rename' && (
                        <div className={styles.formContainer}>
                            <div className={styles.header}>Rename Profile</div>
                            <form onSubmit={handleRename} className={styles.addForm}>
                                <input
                                    name="name"
                                    defaultValue={activeProfile?.name}
                                    autoFocus
                                    className={styles.input}
                                    maxLength={12}
                                />
                                <button type="submit" className={styles.addBtn}>Save</button>
                            </form>
                            <button onClick={() => setMode('list')} className={styles.backBtn}>Cancel</button>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
