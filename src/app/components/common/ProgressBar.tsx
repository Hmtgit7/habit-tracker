'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number;
    color?: string;
    height?: number;
    showPercentage?: boolean;
    className?: string;
    animate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    color = '#4F46E5',
    height = 8,
    showPercentage = false,
    className = '',
    animate = true
}) => {
    // Ensure progress is between 0 and 100
    const validProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className={`w-full flex flex-col ${className}`}>
            {showPercentage && (
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{validProgress}%</span>
                </div>
            )}
            <div
                className="w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700"
                style={{ height: `${height}px` }}
            >
                {animate ? (
                    <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${validProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{ backgroundColor: color }}
                    />
                ) : (
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: `${validProgress}%`,
                            backgroundColor: color
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ProgressBar;