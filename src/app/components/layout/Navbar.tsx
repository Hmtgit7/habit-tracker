'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';
import { useHabitContext } from '../providers/HabitProvider';
import NotificationPanel from './NotificationPanel';
import SettingsPanel from './SettingsPanel';

const Navbar: React.FC = () => {
    const { darkMode, toggleDarkMode } = useThemeContext();
    const { user, notifications } = useHabitContext();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Close panels when clicking elsewhere
    const handleNavbarClick = (e: React.MouseEvent) => {
        // Only close if clicking directly on the navbar, not its children
        if ((e.target as HTMLElement).classList.contains('navbar-container')) {
            setShowNotifications(false);
            setShowSettings(false);
        }
    };

    return (
        <div
            className="navbar-container fixed top-0 left-0 right-0 z-30"
            onClick={handleNavbarClick}
        >
            <nav className={`transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-md`}>
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo and App Name */}
                    <div className="flex items-center">
                        <motion.div
                            whileHover={{ rotate: 10 }}
                            className="mr-3 text-2xl hidden sm:block"
                        >
                            📊
                        </motion.div>
                        <h1 className="text-xl font-bold">HabitHub</h1>
                    </div>

                    {/* Nav Controls */}
                    <div className="flex items-center">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    setShowSettings(false);
                                }}
                                className="relative p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-200 mr-2"
                                aria-label="Notifications"
                            >
                                <span className="text-xl">🔔</span>
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            {/* Notification Panel */}
                            <NotificationPanel
                                isVisible={showNotifications}
                                onClose={() => setShowNotifications(false)}
                            />
                        </div>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-200 mr-2"
                            aria-label={darkMode ? "Light mode" : "Dark mode"}
                        >
                            <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
                        </button>

                        {/* Settings */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowSettings(!showSettings);
                                    setShowNotifications(false);
                                }}
                                className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-200 mr-2"
                                aria-label="Settings"
                            >
                                <span className="text-xl">⚙️</span>
                            </button>

                            {/* Settings Panel */}
                            <SettingsPanel
                                isVisible={showSettings}
                                onClose={() => setShowSettings(false)}
                            />
                        </div>

                        {/* User Profile */}
                        {user && (
                            <div className="flex items-center ml-4">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full border-2 border-indigo-500"
                                />
                                <span className="ml-2 hidden md:inline">{user.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;