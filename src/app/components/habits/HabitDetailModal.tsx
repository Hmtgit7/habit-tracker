'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';
import { Habit } from '../types';
import { formatDate } from '../utils/dateHelpers';
import { calculateProgress } from '../utils/habitHelpers';
import Button from '../common/Button';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

interface HabitDetailModalProps {
    habit: Habit | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (habit: Habit, value: number) => void;
}

const HabitDetailModal: React.FC<HabitDetailModalProps> = ({
    habit,
    isOpen,
    onClose,
    onUpdate
}) => {
    const { darkMode } = useThemeContext();

    if (!habit) return null;

    const handleComplete = () => {
        onUpdate(habit, habit.target);
    };

    const handleReset = () => {
        onUpdate(habit, 0);
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        onUpdate(habit, value);
    };

    const handleIncrement = () => {
        onUpdate(habit, habit.current + 1);
    };

    const handleDecrement = () => {
        if (habit.current > 0) {
            onUpdate(habit, habit.current - 1);
        }
    };

    // Get last 7 days of habit data
    const recentHistory = [...habit.history]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7)
        .map(item => ({
            date: formatDate(item.date),
            value: item.value
        }));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className={`w-full max-w-md p-6 rounded-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <span className="text-2xl mr-2">{habit.icon}</span>
                                <h2 className="text-xl font-bold">{habit.name}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Daily Progress</p>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xl font-bold">
                                    {habit.current} / {habit.target} {habit.unit}
                                </span>
                                <span className="text-sm bg-indigo-600 bg-opacity-10 text-indigo-600 px-2 py-1 rounded-full">
                                    {calculateProgress(habit.current, habit.target)}%
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${calculateProgress(habit.current, habit.target)}%`,
                                        backgroundColor: habit.color
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Update Progress</p>
                            <div className="flex items-center justify-between mb-2">
                                <button
                                    onClick={handleDecrement}
                                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    -
                                </button>

                                <input
                                    type="range"
                                    min="0"
                                    max={habit.target * 2}
                                    value={habit.current}
                                    onChange={handleSliderChange}
                                    className="flex-1 mx-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    style={{ accentColor: habit.color }}
                                />

                                <button
                                    onClick={handleIncrement}
                                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex justify-between mt-6">
                                <Button
                                    variant="secondary"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>

                                <Button
                                    variant="primary"
                                    onClick={handleComplete}
                                >
                                    Complete
                                </Button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <span className="text-xl mr-2">🔥</span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
                            </div>
                            <p className="text-xl font-bold">{habit.streak} days</p>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Weekly History</p>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={recentHistory}
                                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                                borderColor: habit.color
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            name={habit.unit}
                                            stroke={habit.color}
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HabitDetailModal;