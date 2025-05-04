'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';
import { useHabitContext } from '../providers/HabitProvider';
import Button from '../common/Button';

interface NotificationPanelProps {
    isVisible: boolean;
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
    isVisible,
    onClose
}) => {
    const { darkMode } = useThemeContext();
    const { notifications, markNotificationAsRead, clearAllNotifications } = useHabitContext();
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
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Notifications</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllNotifications}
                            disabled={notifications.length === 0}
                        >
                            Clear All
                        </Button>
                    </div>

                    {notifications.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => markNotificationAsRead(notification.id)}
                                    className={`p-3 mb-2 rounded-lg cursor-pointer ${notification.read ? 'opacity-60' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                >
                                    <div className="flex items-start">
                                        <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notification.read ? 'bg-gray-400' : 'bg-green-500'}`}></div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm">{notification.message}</p>
                                            <p className="text-xs mt-1 text-gray-500">{notification.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-gray-500">
                            <p>No notifications</p>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationPanel;