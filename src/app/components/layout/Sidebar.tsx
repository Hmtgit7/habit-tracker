'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';
import { useHabitContext } from '../providers/HabitProvider';
import Button from '../common/Button';

interface SidebarProps {
    currentView: string;
    onChangeView: (view: string) => void;
    onAddHabit: () => void;
    onShowAchievements: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    currentView,
    onChangeView,
    onAddHabit,
    onShowAchievements
}) => {
    const { darkMode } = useThemeContext();
    const { user } = useHabitContext();

    return (
        <div
            className={`fixed left-0 bottom-0 top-16 w-16 md:w-64 
      ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'} 
      transition-colors duration-300 shadow-md z-20 overflow-hidden`}
        >
            <div className="p-4 h-full flex flex-col">
                {/* User Profile (Desktop Only) */}
                <div className="mb-6 hidden md:block">
                    {user && (
                        <div className="flex flex-col items-center mb-6">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-20 h-20 rounded-full border-4 border-indigo-500 mb-3"
                            />
                            <h3 className="font-bold text-lg">{user.name}</h3>
                            <div className="flex items-center mt-2">
                                <span className="text-sm">Level {user.level}</span>
                                <div className="w-32 h-2 bg-gray-200 rounded-full ml-2 dark:bg-gray-700">
                                    <div
                                        className="h-full bg-indigo-600 rounded-full"
                                        style={{ width: `${(user.points % 1000) / 1000 * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex items-center mt-3">
                                <span className="text-lg mr-2">🔥</span>
                                <span className="font-bold">{user.streak} day streak</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => onChangeView('dashboard')}
                                className={`flex items-center p-3 w-full rounded-lg transition-colors 
                ${currentView === 'dashboard'
                                        ? 'bg-indigo-600 text-white'
                                        : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                            >
                                <span className="text-xl md:mr-3">📊</span>
                                <span className="hidden md:inline">Dashboard</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onChangeView('habits')}
                                className={`flex items-center p-3 w-full rounded-lg transition-colors 
                ${currentView === 'habits'
                                        ? 'bg-indigo-600 text-white'
                                        : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                            >
                                <span className="text-xl md:mr-3">✅</span>
                                <span className="hidden md:inline">My Habits</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onChangeView('insights')}
                                className={`flex items-center p-3 w-full rounded-lg transition-colors 
                ${currentView === 'insights'
                                        ? 'bg-indigo-600 text-white'
                                        : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                            >
                                <span className="text-xl md:mr-3">📈</span>
                                <span className="hidden md:inline">Insights</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={onShowAchievements}
                                className={`flex items-center p-3 w-full rounded-lg transition-colors 
                ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                            >
                                <span className="text-xl md:mr-3">🏆</span>
                                <span className="hidden md:inline">Achievements</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Add Habit Button */}
                <div className="mt-auto">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={onAddHabit}
                        leftIcon={<span className="text-xl">➕</span>}
                    >
                        <span className="hidden md:inline">Add Habit</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;