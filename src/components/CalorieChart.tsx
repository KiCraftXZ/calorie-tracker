'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DataPoint {
    date: string;
    total: number;
}

interface Props {
    data: DataPoint[];
    goal: number;
}

export function CalorieChart({ data, goal }: Props) {
    // Pad data to ensure we have 7 days roughly if empty
    const displayData = data.length > 0 ? data : [{ date: 'Today', total: 0 }];

    return (
        <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#B4B0BE', fontSize: 10, fontWeight: 700 }}
                        tickFormatter={(val) => {
                            const d = new Date(val);
                            return isNaN(d.getTime()) ? val : d.toLocaleDateString(undefined, { weekday: 'short' });
                        }}
                    />
                    <YAxis hide />
                    <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 8 }}
                        contentStyle={{
                            borderRadius: 16,
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            padding: '8px 12px'
                        }}
                        labelStyle={{ display: 'none' }}
                    />
                    <Bar dataKey="total" radius={[8, 8, 8, 8]} barSize={24}>
                        {displayData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.total > goal ? '#FFD460' : '#FF9EB5'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
