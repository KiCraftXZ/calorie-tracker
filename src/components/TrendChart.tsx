'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DataPoint {
    date: string;
    total: number;
}

interface Props {
    data: DataPoint[];
    goal: number;
}

export function TrendChart({ data }: Props) {
    const displayData = data.length > 0 ? data : [{ date: 'Today', total: 0 }];

    return (
        <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE8E0" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#5C6157', fontSize: 10 }}
                        tickFormatter={(val) => {
                            const d = new Date(val);
                            return isNaN(d.getTime()) ? val : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
                        }}
                        minTickGap={30}
                    />
                    <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                    <Tooltip
                        cursor={{ stroke: '#4F5D48', strokeWidth: 1, strokeDasharray: '4 4' }}
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
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#4F5D48"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#4F5D48', stroke: '#F7F5F0', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
