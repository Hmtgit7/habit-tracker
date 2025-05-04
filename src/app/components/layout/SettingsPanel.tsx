'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';
import Button from '../common/Button';

interface SettingsPanelProps {
    isVisible: boolean;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isVisible,
    onClose
}) => {
    const { darkMode, toggleDarkMode } = useThemeContext();
    const [animation, setAnimation] = useState(true);
    const [reminderTime, setReminderTime] = useState('20:00');
    const panelRef = useRef<HTMLDivElement>(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible, onClose]);

    // Mock export data function
    const handleExportData = () => {
        alert('Your habits data has been exported successfully!');
        onClose();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`absolute right-2 top-16 w-80 md:w-96 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-4 z-40`}
                >
                    <h3 className="font-bold text-lg mb-4">Settings</h3>

                    <div className="space-y-4">
                        {/* Dark Mode Toggle */}
                        <div className="flex justify-between items-center">
                            <label htmlFor="dark-mode">Dark Mode</label>
                            <button
                                onClick={toggleDarkMode}
                                className={`w-12 h-6 rounded-full p-1 ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <motion.div
                                    animate={{ x: darkMode ? 24 : 0 }}
                                    className="w-4 h-4 bg-white rounded-full"
                                />
                            </button>
                        </div>

                        {/* Animation Toggle */}
                        <div className="flex justify-between items-center">
                            <label htmlFor="animations">Animations</label>
                            <button
                                onClick={() => setAnimation(!animation)}
                                className={`w-12 h-6 rounded-full p-1 ${animation ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <motion.div
                                    animate={{ x: animation ? 24 : 0 }}
                                    className="w-4 h-4 bg-white rounded-full"
                                />
                            </button>
                        </div>

                        {/* Reminder Time */}
                        <div>
                            <label htmlFor="reminder-time" className="block mb-1">Daily Reminder Time</label>
                            <input
                                type="time"
                                id="reminder-time"
                                value={reminderTime}
                                onChange={(e) => setReminderTime(e.target.value)}
                                className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                            />
                        </div>

                        {/* Achievements Button */}
                        <div className="pt-2">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => {
                                    onClose();
                                    // This would typically link to the achievements page
                                    // For now, just close the panel
                                }}
                            >
                                View Achievements
                            </Button>
                        </div>

                        {/* Export Data Button */}
                        <div className="pt-2">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={handleExportData}
                            >
                                Export Data
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingsPanel;