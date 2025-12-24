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
                        tick={{ fill: '#888888', fontSize: 10 }}
                        tickFormatter={(val) => {
                            const d = new Date(val);
                            return isNaN(d.getTime()) ? val : d.toLocaleDateString(undefined, { weekday: 'short' });
                        }}
                    />
                    <YAxis hide />
                    <Tooltip
                        cursor={{ fill: '#F5F2EA' }}
                        contentStyle={{
                            borderRadius: 8,
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: 12,
                            color: '#333'
                        }}
                        labelStyle={{ display: 'none' }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 4, 4]} barSize={20}>
                        {displayData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.total > goal ? '#DDA15E' : '#A5A58D'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
