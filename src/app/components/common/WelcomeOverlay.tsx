'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeOverlayProps {
    duration?: number;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
    duration = 3000
}) => {
    const [showWelcome, setShowWelcome] = useState(true);

    useEffect(() => {
        // Hide welcome message after specified duration
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    return (
        <AnimatePresence>
            {showWelcome && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-indigo-600 bg-opacity-90 z-50"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="text-center p-8 rounded-lg"
                    >
                        <h1 className="text-4xl font-bold text-white mb-4">Welcome to HabitHub</h1>
                        <p className="text-xl text-white">Your personal habit tracking assistant</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeOverlay;