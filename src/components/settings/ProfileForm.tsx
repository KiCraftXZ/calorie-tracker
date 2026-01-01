'use client';

import { useState } from 'react';
import { updateProfileDetails, Profile } from '@/app/actions';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { TargetIcon, FlameIcon } from '@/components/ui/Icons';

interface ProfileFormProps {
    profile: Profile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
    const [gender, setGender] = useState(profile.gender || '');
    const [lifestyle, setLifestyle] = useState(profile.lifestyle || '');
    const [weeklyGoal, setWeeklyGoal] = useState(profile.weekly_goal?.toString() || '');

    const inputStyle = {
        background: 'white',
        border: '3px solid var(--accent-olive)', // Leafy/Muted Olive
        padding: '0.875rem 1rem',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        fontSize: '1rem',
        width: '100%',
        fontWeight: 500,
        outline: 'none',
        fontFamily: 'Inter, sans-serif'
    } as const;

    const labelStyle = {
        color: 'var(--text-primary)', // High contrast (Almost Black)
        fontSize: '0.875rem',
        fontWeight: 700, // Bolder
        display: 'block',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    } as const;

    const sectionTitleStyle = {
        fontSize: '1.25rem', // Slightly larger
        fontWeight: 700,
        color: 'var(--text-primary)', // Darker
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '2px solid var(--bg-secondary)',
        paddingBottom: '0.5rem'
    } as const;


    // Lifestyle Options
    const lifestyleOptions = [
        { value: 'Sedentary', label: 'Sedentary (Little or no exercise)' },
        { value: 'Lightly Active', label: 'Lightly Active (Exercise 1-3 days/week)' },
        { value: 'Moderately Active', label: 'Moderately Active (Exercise 3-5 days/week)' },
        { value: 'Very Active', label: 'Very Active (Exercise 6-7 days/week)' },
        { value: 'Extra Active', label: 'Extra Active (Very hard exercise/physical job)' },
    ];

    // Weekly Goal Options
    const weeklyGoalOptions = [
        { value: '-1', label: 'Lose 1 kg per week' },
        { value: '-0.75', label: 'Lose 0.75 kg per week' },
        { value: '-0.5', label: 'Lose 0.5 kg per week' },
        { value: '-0.25', label: 'Lose 0.25 kg per week' },
        { value: '0', label: 'Maintain Weight' },
        { value: '0.25', label: 'Gain 0.25 kg per week' },
        { value: '0.5', label: 'Gain 0.5 kg per week' },
    ];

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ];

    return (
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
                        <CustomSelect
                            label="Gender"
                            options={genderOptions}
                            value={gender}
                            onChange={setGender}
                            name="gender"
                            placeholder="Select Gender"
                        />
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
                        <CustomSelect
                            label="Lifestyle Details"
                            options={lifestyleOptions}
                            value={lifestyle}
                            onChange={setLifestyle}
                            name="lifestyle"
                            placeholder="Select Activity Level"
                        />
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
                        <CustomSelect
                            label="Weekly Goal"
                            options={weeklyGoalOptions}
                            value={weeklyGoal}
                            onChange={setWeeklyGoal}
                            name="weekly_goal"
                            placeholder="Select Goal"
                        />
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
                    background: 'var(--action-primary)', // Vibrant Forest Green
                    border: 'none',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    fontWeight: 700,
                    marginTop: '1rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'transform 0.1s ease, background-color 0.2s',
                    fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--action-primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--action-primary)'}
            >
                Save Changes
            </button>
        </form>
    );
}
