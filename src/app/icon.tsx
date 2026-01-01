import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation - styled like the ProgressRing component
export default function Icon() {
    const radius = 12
    const stroke = 3
    const normalizedRadius = radius - stroke / 2
    const circumference = normalizedRadius * 2 * Math.PI
    // Show ~75% progress for a visually appealing favicon
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
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    {/* Background circle */}
                    <circle
                        cx="14"
                        cy="14"
                        r={normalizedRadius}
                        stroke="#D6D2C4" // Warm grey background (from CSS)
                        strokeWidth={stroke}
                        fill="transparent"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="14"
                        cy="14"
                        r={normalizedRadius}
                        stroke="#4F5D48" // Deep Olive (75% color from ProgressRing)
                        strokeWidth={stroke}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                {/* Center dot for visual interest */}
                <div
                    style={{
                        position: 'absolute',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#4F5D48', // Deep Olive
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    )
}
