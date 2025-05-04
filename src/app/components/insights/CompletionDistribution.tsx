'use client';

import React from 'react';
import { useThemeContext } from '../providers/ThemeProvider';
import { Habit } from '../types';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface CompletionDistributionProps {
    habits: Habit[];
    className?: string;
}

const CompletionDistribution: React.FC<CompletionDistributionProps> = ({
    habits,
    className = ''
}) => {
    const { darkMode } = useThemeContext();

    // Calculate distribution data
    const completed = habits.filter(h => h.current >= h.target).length;
    const inProgress = habits.filter(h => h.current > 0 && h.current < h.target).length;
    const notStarted = habits.filter(h => h.current === 0).length;

    const data = [
        { name: 'Completed', value: completed, color: '#4F46E5' },
        { name: 'In Progress', value: inProgress, color: '#F59E0B' },
        { name: 'Not Started', value: notStarted, color: '#EF4444' },
    ];

    // Custom label formatter that shows both name and percentage
    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent, index, name
    }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = 25 + innerRadius + (outerRadius - innerRadius);
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return percent > 0.05 ? (
            <text
                x={x}
                y={y}
                fill={darkMode ? '#E5E7EB' : '#374151'}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="12"
            >
                {`${name} ${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className={`p-3 rounded-md shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm">{data.value} habits ({(data.value / habits.length * 100).toFixed(0)}%)</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={className}>
            <h3 className="text-lg font-medium mb-4">Completion Distribution</h3>

            {habits.length > 0 ? (
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No habit data available
                    </p>
                </div>
            )}
        </div>
    );
};

export default CompletionDistribution;