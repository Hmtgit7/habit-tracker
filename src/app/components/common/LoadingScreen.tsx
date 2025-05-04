'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';

interface LoadingScreenProps {
    message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    message = 'Loading your habits...'
}) => {
    const { darkMode } = useThemeContext();
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Simulate loading progress
    useEffect(() => {
        const loadingInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(loadingInterval);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);

        return () => clearInterval(loadingInterval);
    }, []);

    return (
        <div className={`fixed inset-0 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className={`text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    HabitHub
                </h1>
                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                    <motion.div
                        className="h-full bg-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${loadingProgress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {message}
                </p>
            </motion.div>
        </div>
    );
};

export default LoadingScreen;