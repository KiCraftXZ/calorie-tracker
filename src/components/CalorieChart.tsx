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
    const displayData = data.length > 0 ? data : [{ date: 'Today', total: 0 }];

    return (
        <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#5C6157', fontSize: 10 }}
                        tickFormatter={(val) => {
                            const d = new Date(val);
                            return isNaN(d.getTime()) ? val : d.toLocaleDateString(undefined, { weekday: 'short' });
                        }}
                    />
                    <YAxis hide />
                    <Tooltip
                        cursor={{ fill: 'rgba(79, 93, 72, 0.05)' }}
                        contentStyle={{
                            borderRadius: 8,
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(79, 93, 72, 0.1)',
                            fontSize: 12,
                            color: '#2C3028',
                            backgroundColor: '#F7F5F0'
                        }}
                        labelStyle={{ display: 'none' }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 4, 4]} barSize={20}>
                        {displayData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.total > goal ? '#C07A55' : '#4F5D48'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
