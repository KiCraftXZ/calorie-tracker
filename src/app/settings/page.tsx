import { getProfileDetails, updateProfileDetails } from '../actions';
import { Card } from '@/components/ui/Card';
import { SettingsIcon, TargetIcon, FlameIcon, ArrowLeftIcon } from '@/components/ui/Icons';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const profile = await getProfileDetails();

    const inputStyle = {
        background: 'white',
        border: '3px solid var(--primary)', // Pickle/Olive Green as requested
        padding: '0.875rem 1rem',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        fontSize: '1rem',
        width: '100%',
        fontWeight: 500,
        outline: 'none',
        appearance: 'none', // Needed for consistent select styling
        backgroundImage: 'none' // We'll add SVG conditionally for selects
    } as const;

    // Helper for Selects to add the arrow
    const selectStyle = {
        ...inputStyle,
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232C3028%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.7rem top 50%',
        backgroundSize: '0.65rem auto',
        paddingRight: '2rem'
    } as const;


    const labelStyle = {
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
        fontWeight: 600,
        display: 'block',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    } as const;

    const sectionTitleStyle = {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: 'var(--primary)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '2px solid var(--bg-secondary)',
        paddingBottom: '0.5rem'
    } as const;

    return (
        <main style={{
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'var(--bg-primary)'
        }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <h1 style={{
                    marginBottom: '2rem',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--text-primary)'
                }}>
                    <SettingsIcon size={28} />
                    Settings
                </h1>

                <Card className="card" style={{ padding: '2rem' }}>
                    <form action={updateProfileDetails} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Personal Details Section */}
                        <section>
                            <h2 style={sectionTitleStyle}>Personal Details</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                {/* Name */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        defaultValue={profile.name}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                {/* Age */}
                                <div>
                                    <label style={labelStyle}>Age</label>
                                    <input
                                        name="age"
                                        type="number"
                                        defaultValue={profile.age || ''}
                                        style={inputStyle}
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label style={labelStyle}>Gender</label>
                                    <select
                                        name="gender"
                                        defaultValue={profile.gender || ''}
                                        style={selectStyle}
                                    >
                                        <option value="" disabled>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                {/* Height */}
                                <div>
                                    <label style={labelStyle}>Height (cm)</label>
                                    <input
                                        name="height"
                                        type="number"
                                        defaultValue={profile.height || ''}
                                        style={inputStyle}
                                    />
                                </div>

                                {/* Current Weight */}
                                <div>
                                    <label style={labelStyle}>Current Weight (kg)</label>
                                    <input
                                        name="current_weight"
                                        type="number"
                                        defaultValue={profile.current_weight || ''}
                                        style={inputStyle}
                                    />
                                </div>

                                {/* Lifestyle Dropdown */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Lifestyle Details</label>
                                    <select
                                        name="lifestyle"
                                        defaultValue={profile.lifestyle || ''}
                                        style={selectStyle}
                                    >
                                        <option value="" disabled>Select Activity Level</option>
                                        <option value="Sedentary">Sedentary (Little or no exercise)</option>
                                        <option value="Lightly Active">Lightly Active (Exercise 1-3 days/week)</option>
                                        <option value="Moderately Active">Moderately Active (Exercise 3-5 days/week)</option>
                                        <option value="Very Active">Very Active (Exercise 6-7 days/week)</option>
                                        <option value="Extra Active">Extra Active (Very hard exercise/physical job)</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Goals Section */}
                        <section>
                            <h2 style={sectionTitleStyle}>Goals</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                {/* Target Weight */}
                                <div>
                                    <label style={labelStyle}>Target Weight (kg)</label>
                                    <input
                                        name="target_weight"
                                        type="number"
                                        defaultValue={profile.target_weight || ''}
                                        style={inputStyle}
                                    />
                                </div>

                                {/* Weekly Goal Dropdown */}
                                <div>
                                    <label style={labelStyle}>Weekly Goal</label>
                                    <select
                                        name="weekly_goal"
                                        defaultValue={profile.weekly_goal || ''}
                                        style={selectStyle}
                                    >
                                        <option value="" disabled>Select Goal</option>
                                        <option value="-1">Lose 1 kg per week</option>
                                        <option value="-0.75">Lose 0.75 kg per week</option>
                                        <option value="-0.5">Lose 0.5 kg per week</option>
                                        <option value="-0.25">Lose 0.25 kg per week</option>
                                        <option value="0">Maintain Weight</option>
                                        <option value="0.25">Gain 0.25 kg per week</option>
                                        <option value="0.5">Gain 0.5 kg per week</option>
                                    </select>
                                </div>

                                {/* Daily Calorie Goal */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{
                                        ...labelStyle,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem'
                                    }}>
                                        <TargetIcon size={16} />
                                        Daily Calorie Goal
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--text-light)'
                                        }}>
                                            <FlameIcon size={20} />
                                        </div>
                                        <input
                                            name="goal"
                                            type="number"
                                            defaultValue={profile.daily_goal}
                                            style={{
                                                ...inputStyle,
                                                paddingLeft: '3rem'
                                            }}
                                        />
                                    </div>
                                    <p style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--text-light)',
                                        marginTop: '0.5rem'
                                    }}>
                                        Recommended: 1,800 – 2,500 kcal/day
                                    </p>
                                </div>
                            </div>
                        </section>

                        <button
                            type="submit"
                            style={{
                                background: 'var(--primary)', // Solid Olive
                                border: 'none',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                color: 'white',
                                fontWeight: 600,
                                marginTop: '1rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                transition: 'transform 0.1s ease',
                            }}
                        >
                            Save Changes
                        </button>
                    </form>
                </Card>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <Link href="/" style={{
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'white',
                        border: '1px solid var(--card-border)',
                        boxShadow: 'var(--card-shadow)'
                    }}>
                        <ArrowLeftIcon size={18} />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}
