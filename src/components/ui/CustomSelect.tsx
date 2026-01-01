'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    label: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    name?: string;
}

export function CustomSelect({ label, options, value, onChange, placeholder, name }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            {/* Hidden input for form submission if needed, though we primarily control state in ProfileForm */}
            {name && <input type="hidden" name={name} value={value} />}

            <label style={{
                color: 'var(--text-primary)', // High contrast
                fontSize: '0.875rem',
                fontWeight: 700,
                display: 'block',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {label}
            </label>

            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'white',
                    border: `3px solid ${isOpen ? 'var(--primary)' : 'var(--accent-olive)'}`, // Highlight on open
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    color: selectedOption ? 'var(--text-primary)' : 'var(--text-light)', // Muted if placeholder
                    fontSize: '1rem',
                    width: '100%',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.2s',
                    fontFamily: 'Inter, sans-serif'
                }}
            >
                <span>{selectedOption ? selectedOption.label : (placeholder || 'Select...')}</span>

                {/* Custom Arrow */}
                <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        opacity: 0.6
                    }}
                >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '0.5rem',
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--card-border)',
                    boxShadow: 'var(--card-shadow-hover)',
                    zIndex: 50,
                    maxHeight: '240px',
                    overflowY: 'auto',
                    animation: 'fadeIn 0.1s ease-out'
                }}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            style={{
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                fontSize: '0.9375rem',
                                color: 'var(--text-primary)',
                                background: option.value === value ? 'var(--bg-secondary)' : 'transparent',
                                transition: 'background-color 0.1s',
                                borderBottom: '1px solid rgba(0,0,0,0.02)',
                                fontFamily: 'Inter, sans-serif'
                            }}
                            onMouseEnter={(e) => {
                                if (option.value !== value) {
                                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (option.value !== value) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
