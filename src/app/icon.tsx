import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation - Progress Ring + Smiling Pear
export default function Icon() {
    const radius = 12
    const stroke = 3
    const normalizedRadius = radius - stroke / 2
    const circumference = normalizedRadius * 2 * Math.PI
    // Show ~75% progress
    const progress = 75
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#F7F5F0', // Rice Paper
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                }}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    {/* Background circle */}
                    <circle
                        cx="16"
                        cy="16"
                        r={normalizedRadius}
                        stroke="#D6D2C4" // Warm grey
                        strokeWidth={stroke}
                        fill="transparent"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="16"
                        cy="16"
                        r={normalizedRadius}
                        stroke="#4F5D48" // Deep Olive
                        strokeWidth={stroke}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>

                {/* Smiling Pear (centered absolute) */}
                <div
                    style={{
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                    }}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="#B5C99A" // Pear Green (lighter than ring)
                        stroke="#4F5D48" // Deep Olive outline
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {/* Pear Body */}
                        <path d="M12 22 c-3 0 -5 -2 -6 -5 c 0 -3 2 -4 2 -7 c 0 -3 2 -4 4 -4 c 2 0 4 1 4 4 c 0 3 2 4 2 7 c 0 3 -2 5 -6 5 Z" />
                        {/* Stem */}
                        <path d="M12 6 c 0 -3 2 -2 2 -4" strokeWidth="1.5" fill="none" />
                        {/* Smile */}
                        <path d="M9 14.5 c 1.5 1 3.5 1 5 0" strokeWidth="1.5" fill="none" />
                        {/* Eyes */}
                        <circle cx="9.5" cy="11.5" r="1" fill="#4F5D48" stroke="none" />
                        <circle cx="14.5" cy="11.5" r="1" fill="#4F5D48" stroke="none" />
                    </svg>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
