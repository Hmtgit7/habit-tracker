'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReminderToastProps {
    message: string;
    icon?: string;
    isVisible: boolean;
    onHide: () => void;
    autoHideDuration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    variant?: 'success' | 'warning' | 'error' | 'info';
}

const ReminderToast: React.FC<ReminderToastProps> = ({
    message,
    icon = '🎉',
    isVisible,
    onHide,
    autoHideDuration = 3000,
    position = 'bottom-right',
    variant = 'success'
}) => {
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isVisible && autoHideDuration > 0) {
            timer = setTimeout(() => {
                onHide();
            }, autoHideDuration);
        }

        return () => clearTimeout(timer);
    }, [isVisible, autoHideDuration, onHide]);

    // Set toast position
    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4'
    };

    // Set color based on variant
    const variantClasses = {
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: position.includes('top') ? -50 : 50, x: 0 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: position.includes('top') ? -50 : 50, x: 0 }}
                    className={`fixed ${positionClasses[position]} z-50 max-w-xs ${variantClasses[variant]} p-4 rounded-lg shadow-lg`}
                >
                    <div className="flex items-center">
                        <span className="text-xl mr-2">{icon}</span>
                        <p>{message}</p>
                        <button
                            onClick={onHide}
                            className="ml-auto pl-2 text-white opacity-70 hover:opacity-100"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReminderToast;