'use client';

import React from 'react';
import { useThemeContext } from '../providers/ThemeProvider';
import { Habit } from '../types';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Cell, ResponsiveContainer
} from 'recharts';

interface StreakAnalysisProps {
    habits: Habit[];
    className?: string;
}

const StreakAnalysis: React.FC<StreakAnalysisProps> = ({
    habits,
    className = ''
}) => {
    const { darkMode } = useThemeContext();

    // Prepare data for the chart
    const data = habits
        .map(h => ({
            name: h.name,
            streak: h.streak,
            color: h.color
        }))
        .sort((a, b) => b.streak - a.streak); // Sort by streak in descending order

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-3 rounded-md shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm">Current Streak: {payload[0].value} days</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={className}>
            <h3 className="text-lg font-medium mb-4">Streak Analysis</h3>

            {habits.length > 0 ? (
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={darkMode ? '#374151' : '#E5E7EB'}
                                horizontal={false}
                            />
                            <XAxis
                                type="number"
                                tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={100}
                                tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="streak"
                                name="Current Streak (days)"
                                radius={[0, 4, 4, 0]}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
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

export default StreakAnalysis;