'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';
import { Habit } from '../types';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { calculateProgress } from '../utils/habitHelpers';

interface HabitOverviewProps {
    habits: Habit[];
    onViewAllClick: () => void;
    onUpdateClick: (habit: Habit) => void;
    className?: string;
}

const HabitOverview: React.FC<HabitOverviewProps> = ({
    habits,
    onViewAllClick,
    onUpdateClick,
    className = ''
}) => {
    const { darkMode } = useThemeContext();

    // Take only the first 3 habits for the overview
    const displayHabits = habits.slice(0, 3);

    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Habits Overview</h2>
                <Button
                    variant="ghost"
                    onClick={onViewAllClick}
                    rightIcon={<span className="ml-1">→</span>}
                >
                    View All
                </Button>
            </div>

            {displayHabits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayHabits.map(habit => (
                        <motion.div
                            key={habit.id}
                            whileHover={{ y: -5 }}
                            className={`p-4 rounded-lg border-l-4`}
                            style={{ borderLeftColor: habit.color }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <span className="text-xl mr-2">{habit.icon}</span>
                                    <h3 className="font-medium">{habit.name}</h3>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm font-bold mr-1">{habit.streak}</span>
                                    <span className="text-sm">🔥</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{habit.current} / {habit.target} {habit.unit}</span>
                                    <span>{calculateProgress(habit.current, habit.target)}%</span>
                                </div>
                                <ProgressBar
                                    progress={calculateProgress(habit.current, habit.target)}
                                    color={habit.color}
                                />
                            </div>

                            <Button
                                variant="outline"
                                fullWidth
                                className="mt-4"
                                onClick={() => onUpdateClick(habit)}
                            >
                                Update Progress
                            </Button>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        You haven't added any habits yet
                    </p>
                    <Button
                        variant="primary"
                        onClick={onViewAllClick}
                    >
                        Add Your First Habit
                    </Button>
                </div>
            )}
        </div>
    );
};

export default HabitOverview;