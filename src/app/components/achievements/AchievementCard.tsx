'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';
import { Achievement } from '../types';

interface AchievementCardProps {
    achievement: Achievement;
    className?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
    achievement,
    className = ''
}) => {
    const { darkMode } = useThemeContext();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-4 rounded-lg ${achievement.completed
                ? darkMode ? 'bg-indigo-900 bg-opacity-30' : 'bg-indigo-50'
                : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                } ${className}`}
        >
            <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">{achievement.icon}</span>
                <div>
                    <h4 className="font-medium">{achievement.name}</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {achievement.description}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
                <span className={`text-sm px-2 py-1 rounded-full ${achievement.completed
                        ? 'bg-green-500 bg-opacity-20 text-green-500'
                        : 'bg-gray-500 bg-opacity-20 text-gray-500'
                    }`}>
                    {achievement.completed ? 'Completed' : 'In Progress'}
                </span>

                {achievement.completed && (
                    <span className="text-xl">🎖️</span>
                )}
            </div>
        </motion.div>
    );
};

export default AchievementCard;