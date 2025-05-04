'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';

interface StatsCardProps {
    icon: string;
    title: string;
    value: string | number;
    color?: string;
    bgColor?: string;
    className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    icon,
    title,
    value,
    color = 'indigo',
    bgColor,
    className = ''
}) => {
    const { darkMode } = useThemeContext();

    // Define color classes
    const colorClasses: Record<string, { bg: string; darkBg: string }> = {
        indigo: { bg: 'bg-indigo-50', darkBg: 'dark:bg-indigo-900 dark:bg-opacity-20' },
        blue: { bg: 'bg-blue-50', darkBg: 'dark:bg-blue-900 dark:bg-opacity-20' },
        green: { bg: 'bg-green-50', darkBg: 'dark:bg-green-900 dark:bg-opacity-20' },
        red: { bg: 'bg-red-50', darkBg: 'dark:bg-red-900 dark:bg-opacity-20' },
        yellow: { bg: 'bg-yellow-50', darkBg: 'dark:bg-yellow-900 dark:bg-opacity-20' },
        purple: { bg: 'bg-purple-50', darkBg: 'dark:bg-purple-900 dark:bg-opacity-20' },
    };

    const bgColorClass = bgColor || (colorClasses[color]
        ? `${colorClasses[color].bg} ${colorClasses[color].darkBg}`
        : 'bg-gray-50 dark:bg-gray-800');

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-4 rounded-lg ${bgColorClass} ${className}`}
        >
            <div className="flex items-center mb-2">
                <span className="text-xl mr-2">{icon}</span>
                <h3 className="font-medium">{title}</h3>
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </motion.div>
    );
};

export default StatsCard;