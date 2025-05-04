'use client';

import React, { useState } from 'react';
import { useThemeContext } from '../providers/ThemeProvider';
import { useHabitContext } from '../providers/HabitProvider';
import { formatDate } from '../utils/dateHelpers';
import { calculateProgress } from '../utils/habitHelpers';
import Button from '../common/Button';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const HabitAnalytics: React.FC = () => {
    const { darkMode } = useThemeContext();
    const { habits, getFilteredHistory } = useHabitContext();
    const [selectedHabitId, setSelectedHabitId] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year' | 'all'>('week');

    // Find selected habit
    const selectedHabit = habits.find(h => h.id === selectedHabitId);

    // Get filtered history data based on selected date range
    const historyData = selectedHabit
        ? getFilteredHistory(selectedHabit).map(item => ({
            date: formatDate(item.date),
            value: item.value
        }))
        : [];

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length && selectedHabit) {
            return (
                <div className={`p-3 rounded-md shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm">
                        <span
                            className="inline-block w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: selectedHabit.color }}
                        ></span>
                        {payload[0].value} {selectedHabit.unit}
                    </p>
                    <p className="text-sm">
                        {payload[0].value >= selectedHabit.target ? (
                            <span className="text-green-500">Target achieved</span>
                        ) : (
                            <span className="text-yellow-500">
                                {selectedHabit.target - payload[0].value} {selectedHabit.unit} remaining
                            </span>
                        )}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <h3 className="text-lg font-medium mb-4">Habit Detail</h3>

            <div className="mb-4">
                <label htmlFor="habit-select" className="block mb-2">Select a habit to view details:</label>
                <select
                    id="habit-select"
                    value={selectedHabitId}
                    onChange={(e) => setSelectedHabitId(e.target.value)}
                    className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                        } border ${darkMode ? 'border-gray-600' : 'border-gray-300'
                        }`}
                >
                    <option value="">Select a habit</option>
                    {habits.map(habit => (
                        <option key={habit.id} value={habit.id}>{habit.name}</option>
                    ))}
                </select>
            </div>

            {selectedHabit ? (
                <div className="mt-6">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">{selectedHabit.icon}</span>
                        <h3 className="text-xl font-bold">{selectedHabit.name}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Streak</h4>
                            <p className="text-2xl font-bold">{selectedHabit.streak} days</p>
                        </div>

                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Today's Progress</h4>
                            <p className="text-2xl font-bold">
                                {selectedHabit.current} / {selectedHabit.target} {selectedHabit.unit}
                            </p>
                        </div>

                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Completion Rate</h4>
                            <p className="text-2xl font-bold">
                                {calculateProgress(selectedHabit.current, selectedHabit.target)}%
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-medium">Progress History</h4>
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
                                <Button
                                    variant={dateFilter === 'year' ? 'primary' : 'secondary'}
                                    size="sm"
                                    onClick={() => setDateFilter('year')}
                                >
                                    Year
                                </Button>
                            </div>
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={historyData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                                    />
                                    <YAxis
                                        tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        name={`${selectedHabit.name} (${selectedHabit.unit})`}
                                        stroke={selectedHabit.color}
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    {/* Add target line */}
                                    <Line
                                        type="monotone"
                                        dataKey={() => selectedHabit.target}
                                        name="Target"
                                        stroke="#9CA3AF"
                                        strokeDasharray="5 5"
                                        strokeWidth={1}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Select a habit to view detailed insights</p>
                </div>
            )}
        </div>
    );
};

export default HabitAnalytics;