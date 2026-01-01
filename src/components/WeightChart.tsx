'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { WeightEntry } from '@/app/actions';

interface Props {
    data: WeightEntry[];
    targetWeight?: number;
}

export function WeightChart({ data, targetWeight }: Props) {
    if (data.length === 0) {
        return (
            <div style={{
                height: 250,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.875rem'
            }}>
                No weight data yet. Add your first entry!
            </div>
        );
    }

    // Sort data by date ascending for the chart
    const chartData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(entry => ({
        ...entry,
        formattedDate: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

    // Calculate domain to make the chart look nice (not starting from 0)
    const weights = data.map(d => d.weight);
    if (targetWeight) weights.push(targetWeight);

    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const domainMin = Math.floor(minWeight - 5);
    const domainMax = Math.ceil(maxWeight + 5);

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="formattedDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 10 }}
                        minTickGap={30}
                    />
                    <YAxis
                        hide={false}
                        domain={[domainMin, domainMax]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 10 }}
                        width={30}
                    />
                    <Tooltip
                        cursor={{ stroke: 'var(--primary)', strokeDasharray: '5 5' }}
                        contentStyle={{
                            borderRadius: 8,
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontSize: 12,
                        }}
                    />
                    {targetWeight && (
                        <ReferenceLine
                            y={targetWeight}
                            stroke="#C07A55"
                            strokeDasharray="3 3"
                            label={{
                                value: 'Target',
                                position: 'right',
                                fill: '#C07A55',
                                fontSize: 10
                            }}
                        />
                    )}
                    <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorWeight)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
