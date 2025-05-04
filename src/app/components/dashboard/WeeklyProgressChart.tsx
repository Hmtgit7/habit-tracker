'use client';

import React, { useState } from 'react';
import { useThemeContext } from '../providers/ThemeProvider';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Button from '../common/Button';

interface WeeklyProgressChartProps {
    data: {
        day: string;
        completed: number;
        total: number;
    }[];
    className?: string;
}

const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({
    data,
    className = ''
}) => {
    const { darkMode } = useThemeContext();
    const [dateFilter, setDateFilter] = useState<'week' | 'month'>('week');

    // Custom tooltip component for the chart
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-3 rounded-md shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm">
                        <span className="inline-block w-3 h-3 bg-indigo-600 rounded-full mr-1"></span>
                        Completed: {payload[0].value}
                    </p>
                    <p className="text-sm">
                        <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
                        Total: {payload[0].payload.total}
                    </p>
                    <p className="text-sm font-medium">
                        Completion Rate: {Math.round((payload[0].value / payload[0].payload.total) * 100)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Weekly Progress</h2>
                <div className="flex space-x-2">
                    <Button
                        variant={dateFilter === 'week' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setDateFilter('week')}
                    >
                        Week
                    </Button>
                    <Button
                        variant={dateFilter === 'month' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setDateFilter('month')}
                    >
                        Month
                    </Button>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                        <XAxis
                            dataKey="day"
                            tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                        />
                        <YAxis
                            tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            name="Completed Habits"
                            dataKey="completed"
                            fill="#6366F1"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WeeklyProgressChart;