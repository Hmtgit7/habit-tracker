'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';
import { useHabitContext } from '../providers/HabitProvider';
import Button from '../common/Button';
import AchievementCard from './AchievementCard';

interface AchievementsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({
    isOpen,
    onClose
}) => {
    const { darkMode } = useThemeContext();
    const { user } = useHabitContext();

    if (!user) return null;

    // Calculate completion percentage
    const completedCount = user.achievements.filter(a => a.completed).length;
    const totalCount = user.achievements.length;
    const completionPercentage = Math.round((completedCount / totalCount) * 100);

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
                        className={`w-full max-w-2xl p-6 rounded-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Achievements</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-600 text-white text-2xl">
                                    🏆
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-bold text-xl">{user.name}</h3>
                                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Level {user.level} • {user.points} points
                                    </p>
                                    <p className="text-sm text-indigo-600 mt-1">
                                        {completedCount} of {totalCount} achievements ({completionPercentage}% complete)
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                            {user.achievements.map(achievement => (
                                <AchievementCard
                                    key={achievement.id}
                                    achievement={achievement}
                                />
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <Button
                                variant="primary"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AchievementsModal;