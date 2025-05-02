import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import Head from 'next/head';
import Image from 'next/image';

// Define types
type Habit = {
    id: string;
    name: string;
    icon: string;
    target: number;
    unit: string;
    current: number;
    color: string;
    streak: number;
    lastUpdated: string;
    history: {
        date: string;
        value: number;
    }[];
};

type User = {
    name: string;
    avatar: string;
    streak: number;
    level: number;
    points: number;
    achievements: {
        id: string;
        name: string;
        icon: string;
        completed: boolean;
        description: string;
    }[];
};

type DashboardStats = {
    completionRate: number;
    totalHabits: number;
    longestStreak: number;
    weeklyProgress: {
        day: string;
        completed: number;
        total: number;
    }[];
    monthlyTrend: {
        month: string;
        value: number;
    }[];
};

type Notification = {
    id: string;
    message: string;
    time: string;
    read: boolean;
};

const HabitTrackerApp: React.FC = () => {
    // State management
    const [darkMode, setDarkMode] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard');
    const [habits, setHabits] = useState<Habit[]>([]);
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
    const [newHabit, setNewHabit] = useState({
        name: '',
        target: 1,
        unit: 'times',
        color: '#4F46E5',
    });
    const [showAchievements, setShowAchievements] = useState(false);
    const [dateFilter, setDateFilter] = useState('week');
    const [loading, setLoading] = useState(true);
    const [animation, setAnimation] = useState(true);
    const [showWelcome, setShowWelcome] = useState(true);
    const [reminderTime, setReminderTime] = useState('20:00');
    const [showReminder, setShowReminder] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const settingsRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('darkMode', String(!darkMode));
    };

    // Mock data initialization
    useEffect(() => {
        // Simulate loading
        const loadingInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(loadingInterval);
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);

        // Check for dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            setDarkMode(true);
        } else if (savedDarkMode === null) {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
        }

        // Initialize mock data
        initializeMockData();

        // Set welcome message timer
        setTimeout(() => {
            setShowWelcome(false);
        }, 3000);

        // Add event listener for clicks outside modals
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            clearInterval(loadingInterval);
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    // Handle clicks outside modals
    const handleOutsideClick = (e: MouseEvent) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
            setIsSettingsOpen(false);
        }
        if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
            setShowNotifications(false);
        }
    };

    // Generate random data for testing
    const initializeMockData = () => {
        // Create mock habits
        const mockHabits: Habit[] = [
            {
                id: '1',
                name: 'Drink Water',
                icon: '💧',
                target: 8,
                unit: 'glasses',
                current: 5,
                color: '#3B82F6',
                streak: 7,
                lastUpdated: new Date().toISOString(),
                history: generateRandomHistory(30, 8),
            },
            {
                id: '2',
                name: 'Exercise',
                icon: '🏃',
                target: 30,
                unit: 'minutes',
                current: 20,
                color: '#EF4444',
                streak: 4,
                lastUpdated: new Date().toISOString(),
                history: generateRandomHistory(30, 30),
            },
            {
                id: '3',
                name: 'Meditate',
                icon: '🧘',
                target: 10,
                unit: 'minutes',
                current: 10,
                color: '#8B5CF6',
                streak: 12,
                lastUpdated: new Date().toISOString(),
                history: generateRandomHistory(30, 10),
            },
            {
                id: '4',
                name: 'Read',
                icon: '📚',
                target: 20,
                unit: 'pages',
                current: 5,
                color: '#F59E0B',
                streak: 2,
                lastUpdated: new Date().toISOString(),
                history: generateRandomHistory(30, 20),
            },
            {
                id: '5',
                name: 'Sleep',
                icon: '😴',
                target: 8,
                unit: 'hours',
                current: 7,
                color: '#10B981',
                streak: 15,
                lastUpdated: new Date().toISOString(),
                history: generateRandomHistory(30, 8),
            },
            {
                id: '6',
                name: 'No Screen Time',
                icon: '📵',
                target: 2,
                unit: 'hours',
                current: 1,
                color: '#6366F1',
                streak: 1,
                lastUpdated: new Date().toISOString(),
                history: generateRandomHistory(30, 2),
            }
        ];

        // Create mock user
        const mockUser: User = {
            name: 'Alex Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            streak: 15,
            level: 7,
            points: 2340,
            achievements: [
                {
                    id: '1',
                    name: 'Early Bird',
                    icon: '🌅',
                    completed: true,
                    description: 'Complete all morning habits for 7 consecutive days'
                },
                {
                    id: '2',
                    name: 'Hydration Master',
                    icon: '💧',
                    completed: true,
                    description: 'Drink 8 glasses of water for 14 consecutive days'
                },
                {
                    id: '3',
                    name: 'Fitness Enthusiast',
                    icon: '💪',
                    completed: false,
                    description: 'Exercise for at least 30 minutes for 30 consecutive days'
                },
                {
                    id: '4',
                    name: 'Zen Master',
                    icon: '🧘',
                    completed: false,
                    description: 'Meditate for 10 minutes for 21 consecutive days'
                },
                {
                    id: '5',
                    name: 'Bookworm',
                    icon: '📚',
                    completed: false,
                    description: 'Read 20 pages every day for 14 consecutive days'
                }
            ]
        };

        // Create mock stats
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const mockStats: DashboardStats = {
            completionRate: 76,
            totalHabits: mockHabits.length,
            longestStreak: 15,
            weeklyProgress: weekDays.map(day => ({
                day,
                completed: Math.floor(Math.random() * 6) + 1,
                total: mockHabits.length
            })),
            monthlyTrend: Array.from({ length: 6 }).map((_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - 5 + i);
                return {
                    month: date.toLocaleString('default', { month: 'short' }),
                    value: Math.floor(Math.random() * 70) + 30
                };
            })
        };

        // Create mock notifications
        const mockNotifications: Notification[] = [
            {
                id: '1',
                message: 'You completed your meditation habit. Great job!',
                time: '2 hours ago',
                read: false
            },
            {
                id: '2',
                message: "Don't forget to drink water today!",
                time: '4 hours ago',
                read: true
            },
            {
                id: '3',
                message: 'Congratulations! You reached a 10-day streak for Reading.',
                time: 'Yesterday',
                read: true
            }
        ];

        // Set all the mock data to state
        setHabits(mockHabits);
        setUser(mockUser);
        setStats(mockStats);
        setNotifications(mockNotifications);
    };

    const generateRandomHistory = (days: number, max: number) => {
        return Array.from({ length: days }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - days + i + 1);
            return {
                date: date.toISOString().split('T')[0],
                value: Math.floor(Math.random() * (max + 1))
            };
        });
    };

    // Handle habit update
    const updateHabitProgress = (habit: Habit, value: number) => {
        const updatedHabits = habits.map(h => {
            if (h.id === habit.id) {
                // Calculate if streak should increase
                let newStreak = h.streak;
                const today = new Date().toISOString().split('T')[0];
                const lastUpdate = new Date(h.lastUpdated).toISOString().split('T')[0];

                // If last update was not today, check if we're on a streak
                if (lastUpdate !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];

                    if (lastUpdate === yesterdayStr && value >= h.target) {
                        newStreak += 1;
                    } else if (value < h.target) {
                        newStreak = 0;
                    }
                }

                // Update history
                const historyIndex = h.history.findIndex(item => item.date === today);
                let newHistory = [...h.history];

                if (historyIndex >= 0) {
                    newHistory[historyIndex] = { date: today, value };
                } else {
                    newHistory.push({ date: today, value });
                }

                return {
                    ...h,
                    current: value,
                    streak: newStreak,
                    lastUpdated: new Date().toISOString(),
                    history: newHistory
                };
            }
            return h;
        });

        setHabits(updatedHabits);

        // Show notification for completed habits
        const updatedHabit = updatedHabits.find(h => h.id === habit.id);
        if (updatedHabit && updatedHabit.current >= updatedHabit.target) {
            const newNotification: Notification = {
                id: Date.now().toString(),
                message: `Great job! You completed your ${updatedHabit.name} habit.`,
                time: 'Just now',
                read: false
            };
            setNotifications([newNotification, ...notifications]);

            // Show a temporary reminder
            setShowReminder(true);
            setTimeout(() => {
                setShowReminder(false);
            }, 3000);
        }
    };

    // Add new habit
    const addNewHabit = () => {
        if (!newHabit.name) return;

        const today = new Date().toISOString();
        const habitIcons = ['💧', '🏃', '🧘', '📚', '😴', '📵', '🍎', '✍️', '🧹'];

        const habit: Habit = {
            id: Date.now().toString(),
            name: newHabit.name,
            icon: habitIcons[Math.floor(Math.random() * habitIcons.length)],
            target: newHabit.target,
            unit: newHabit.unit,
            current: 0,
            color: newHabit.color,
            streak: 0,
            lastUpdated: today,
            history: [{ date: today.split('T')[0], value: 0 }]
        };

        setHabits([...habits, habit]);
        setIsAddHabitOpen(false);
        setNewHabit({
            name: '',
            target: 1,
            unit: 'times',
            color: '#4F46E5'
        });

        // Update stats
        if (stats) {
            setStats({
                ...stats,
                totalHabits: stats.totalHabits + 1
            });
        }
    };

    // Delete habit
    const deleteHabit = (habitId: string) => {
        const updatedHabits = habits.filter(h => h.id !== habitId);
        setHabits(updatedHabits);

        // Update stats
        if (stats) {
            setStats({
                ...stats,
                totalHabits: stats.totalHabits - 1
            });
        }

        // Close habit detail if the deleted habit was selected
        if (selectedHabit && selectedHabit.id === habitId) {
            setSelectedHabit(null);
        }
    };

    // Mark notification as read
    const markNotificationAsRead = (id: string) => {
        const updatedNotifications = notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        );
        setNotifications(updatedNotifications);
    };

    // Clear all notifications
    const clearAllNotifications = () => {
        setNotifications([]);
        setShowNotifications(false);
    };

    // Format date for display
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate progress percentage
    const calculateProgress = (current: number, target: number) => {
        return Math.min(Math.round((current / target) * 100), 100);
    };

    // Get filtered history data based on date range
    const getFilteredHistory = (habit: Habit) => {
        const history = [...habit.history];
        history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let filteredHistory = [];
        const today = new Date();

        switch (dateFilter) {
            case 'week':
                const weekAgo = new Date();
                weekAgo.setDate(today.getDate() - 7);
                filteredHistory = history.filter(item => new Date(item.date) >= weekAgo);
                break;
            case 'month':
                const monthAgo = new Date();
                monthAgo.setMonth(today.getMonth() - 1);
                filteredHistory = history.filter(item => new Date(item.date) >= monthAgo);
                break;
            case 'year':
                const yearAgo = new Date();
                yearAgo.setFullYear(today.getFullYear() - 1);
                filteredHistory = history.filter(item => new Date(item.date) >= yearAgo);
                break;
            default:
                filteredHistory = history;
        }

        return filteredHistory;
    };

    // Calculate completion rate
    const getCompletionRate = () => {
        if (!habits.length) return 0;

        const completed = habits.filter(habit => habit.current >= habit.target).length;
        return Math.round((completed / habits.length) * 100);
    };

    // Loading screen component
    const LoadingScreen = () => (
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
                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${loadingProgress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Loading your habits...
                </p>
            </motion.div>
        </div>
    );

    // Welcome overlay component
    const WelcomeOverlay = () => (
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

    // Navbar component
    const Navbar = () => (
        <nav className={`fixed top-0 left-0 right-0 z-10 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-md transition-colors duration-300`}>
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <motion.div
                        whileHover={{ rotate: 10 }}
                        className="mr-3 text-2xl"
                    >
                        📊
                    </motion.div>
                    <h1 className="text-xl font-bold">HabitHub</h1>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-200 mr-2"
                        aria-label="Notifications"
                    >
                        <span className="text-xl">🔔</span>
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-200 mr-2"
                        aria-label={darkMode ? "Light mode" : "Dark mode"}
                    >
                        <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
                    </button>

                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-200 mr-2"
                        aria-label="Settings"
                    >
                        <span className="text-xl">⚙️</span>
                    </button>

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

            {/* Notifications Panel */}
            <AnimatePresence>
                {showNotifications && (
                    <motion.div
                        ref={notificationRef}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`absolute right-2 top-16 w-80 md:w-96 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-4 z-20`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Notifications</h3>
                            <button
                                onClick={clearAllNotifications}
                                className="text-xs px-2 py-1 rounded-md bg-red-500 bg-opacity-10 text-red-500 hover:bg-opacity-20"
                            >
                                Clear All
                            </button>
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

            {/* Settings Panel */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <motion.div
                        ref={settingsRef}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`absolute right-2 top-16 w-80 md:w-96 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-4 z-20`}
                    >
                        <h3 className="font-bold mb-4">Settings</h3>

                        <div className="space-y-4">
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

                            <div className="pt-2">
                                <button
                                    onClick={() => {
                                        setShowAchievements(true);
                                        setIsSettingsOpen(false);
                                    }}
                                    className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    View Achievements
                                </button>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={() => {
                                        // Simulate data export
                                        alert('Habits data exported successfully!');
                                    }}
                                    className="w-full p-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
                                >
                                    Export Data
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );

    // Sidebar component
    const Sidebar = () => (
        <div className={`fixed left-0 bottom-0 top-16 w-16 md:w-64 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300 shadow-md z-10 overflow-hidden`}>
            <div className="p-4 h-full flex flex-col">
                <div className="mb-4 hidden md:block">
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
                                <div className="w-32 h-2 bg-gray-200 rounded-full ml-2">
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

                <nav className="flex-1">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setCurrentView('dashboard')}
                                className={`flex items-center p-3 w-full rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-indigo-600 text-white' : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                            >
                                <span className="text-xl md:mr-3">✅</span>
                                <span className="hidden md:inline">My Habits</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentView('insights')}
                                className={`flex items-center p-3 w-full rounded-lg transition-colors ${currentView === 'insights' ? 'bg-indigo-600 text-white' : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                            >
                                <span className="text-xl md:mr-3">📈</span>
                                <span className="hidden md:inline">Insights</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setShowAchievements(true)}
                                className={`flex items-center p-3 w-full rounded-lg transition-colors ${showAchievements ? 'bg-indigo-600 text-white' : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                            >
                                <span className="text-xl md:mr-3">🏆</span>
                                <span className="hidden md:inline">Achievements</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={() => setIsAddHabitOpen(true)}
                        className="w-full flex items-center justify-center p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                        <span className="text-xl md:mr-2">➕</span>
                        <span className="hidden md:inline">Add Habit</span>
                    </button>
                </div>
            </div>
        </div>
    );

    // Dashboard View
    const DashboardView = () => (
        <div className="space-y-6 pb-8">
            {/* Welcome Section */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Good {getTimeOfDay()}, {user?.name.split(' ')[0]}</h2>
                    <div className="text-sm px-3 py-1 bg-indigo-600 bg-opacity-10 text-indigo-600 rounded-full">
                        Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {getMotivationalMessage()}
                </p>

                <div className="flex flex-wrap gap-4 mt-6">
                    <div className={`p-4 rounded-lg flex-1 min-w-[150px] ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                        <div className="flex items-center mb-2">
                            <span className="text-xl mr-2">🔥</span>
                            <h3 className="font-medium">Current Streak</h3>
                        </div>
                        <p className="text-2xl font-bold">{user?.streak} days</p>
                    </div>

                    <div className={`p-4 rounded-lg flex-1 min-w-[150px] ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                        <div className="flex items-center mb-2">
                            <span className="text-xl mr-2">📈</span>
                            <h3 className="font-medium">Completion Rate</h3>
                        </div>
                        <p className="text-2xl font-bold">{getCompletionRate()}%</p>
                    </div>

                    <div className={`p-4 rounded-lg flex-1 min-w-[150px] ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                        <div className="flex items-center mb-2">
                            <span className="text-xl mr-2">✅</span>
                            <h3 className="font-medium">Total Habits</h3>
                        </div>
                        <p className="text-2xl font-bold">{habits.length}</p>
                    </div>
                </div>
            </div>

            {/* Weekly Progress Chart */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Weekly Progress</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setDateFilter('week')}
                            className={`px-3 py-1 rounded ${dateFilter === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setDateFilter('month')}
                            className={`px-3 py-1 rounded ${dateFilter === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            Month
                        </button>
                    </div>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={stats?.weeklyProgress}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                    borderColor: '#6366F1'
                                }}
                            />
                            <Legend />
                            <Bar
                                name="Completed Habits"
                                dataKey="completed"
                                fill="#6366F1"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Habits Overview */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Habits Overview</h2>
                    <button
                        onClick={() => setCurrentView('habits')}
                        className="text-indigo-600 hover:underline flex items-center"
                    >
                        View All
                        <span className="ml-1">→</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {habits.slice(0, 3).map(habit => (
                        <motion.div
                            key={habit.id}
                            whileHover={{ y: -5 }}
                            className={`p-4 rounded-lg border-l-4`}
                            style={{ borderLeftColor: habit.color }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <span className="text-xl mr-2">{habit.icon}</span>
                                    <h3 className="font-medium">{habit.name}</h3>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm font-bold mr-1">{habit.streak}</span>
                                    <span className="text-sm">🔥</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{habit.current} / {habit.target} {habit.unit}</span>
                                    <span>{calculateProgress(habit.current, habit.target)}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${calculateProgress(habit.current, habit.target)}%`,
                                            backgroundColor: habit.color
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedHabit(habit)}
                                className="mt-4 w-full p-2 text-center border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
                            >
                                Update Progress
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Monthly Trend */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <h2 className="text-xl font-bold mb-6">Monthly Completion Trend</h2>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={stats?.monthlyTrend}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                    borderColor: '#6366F1'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                name="Completion Rate (%)"
                                dataKey="value"
                                stroke="#6366F1"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    // Habits View
    const HabitsView = () => (
        <div className="space-y-6 pb-8">
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Habits</h2>
                    <button
                        onClick={() => setIsAddHabitOpen(true)}
                        className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                        <span className="mr-2">➕</span>
                        <span>Add Habit</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {habits.map(habit => (
                        <motion.div
                            key={habit.id}
                            whileHover={{ y: -5 }}
                            className={`p-4 rounded-lg border-l-4 ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}
                            style={{ borderLeftColor: habit.color }}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                    <span className="text-xl mr-2">{habit.icon}</span>
                                    <div>
                                        <h3 className="font-medium">{habit.name}</h3>
                                        <p className="text-sm text-gray-500">Target: {habit.target} {habit.unit}/day</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center">
                                        <span className="text-sm font-bold mr-1">{habit.streak}</span>
                                        <span className="text-sm">🔥</span>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">
                                        Last updated: {formatDate(habit.lastUpdated)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{habit.current} / {habit.target} {habit.unit}</span>
                                    <span>{calculateProgress(habit.current, habit.target)}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${calculateProgress(habit.current, habit.target)}%`,
                                            backgroundColor: habit.color
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setSelectedHabit(habit)}
                                    className="p-2 text-center bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => deleteHabit(habit.id)}
                                    className="p-2 text-center border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Insights View
    const InsightsView = () => (
        <div className="space-y-6 pb-8">
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <h2 className="text-2xl font-bold mb-6">Habit Insights</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-medium mb-4">Completion Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Completed', value: habits.filter(h => h.current >= h.target).length },
                                            { name: 'In Progress', value: habits.filter(h => h.current > 0 && h.current < h.target).length },
                                            { name: 'Not Started', value: habits.filter(h => h.current === 0).length },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        <Cell fill="#4F46E5" />
                                        <Cell fill="#F59E0B" />
                                        <Cell fill="#EF4444" />
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                            borderColor: '#6366F1'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-4">Streak Analysis</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={habits.map(h => ({
                                        name: h.name,
                                        streak: h.streak,
                                        color: h.color
                                    }))}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                            borderColor: '#6366F1'
                                        }}
                                    />
                                    <Bar
                                        dataKey="streak"
                                        name="Current Streak (days)"
                                        radius={[0, 4, 4, 0]}
                                    >
                                        {habits.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <h2 className="text-xl font-bold mb-6">Habit Detail</h2>

                <div className="mb-4">
                    <label htmlFor="habit-select" className="block mb-2">Select a habit to view details:</label>
                    <select
                        id="habit-select"
                        value={selectedHabit?.id || ''}
                        onChange={(e) => {
                            const habitId = e.target.value;
                            const habit = habits.find(h => h.id === habitId);
                            setSelectedHabit(habit || null);
                        }}
                        className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    >
                        <option value="">Select a habit</option>
                        {habits.map(habit => (
                            <option key={habit.id} value={habit.id}>{habit.name}</option>
                        ))}
                    </select>
                </div>

                {selectedHabit ? (
                    <div className="mt-6">
                        <div className="flex items-center mb-4">
                            <span className="text-2xl mr-3">{selectedHabit.icon}</span>
                            <h3 className="text-xl font-bold">{selectedHabit.name}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Current Streak</h4>
                                <p className="text-2xl font-bold">{selectedHabit.streak} days</p>
                            </div>

                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Today's Progress</h4>
                                <p className="text-2xl font-bold">
                                    {selectedHabit.current} / {selectedHabit.target} {selectedHabit.unit}
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Completion Rate</h4>
                                <p className="text-2xl font-bold">
                                    {calculateProgress(selectedHabit.current, selectedHabit.target)}%
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-lg font-medium mb-4">Progress History</h4>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={getFilteredHistory(selectedHabit).map(item => ({
                                            date: formatDate(item.date),
                                            value: item.value
                                        }))}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                                borderColor: selectedHabit.color
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            name={`${selectedHabit.name} (${selectedHabit.unit})`}
                                            stroke={selectedHabit.color}
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                        {/* Add target line */}
                                        <Line
                                            type="monotone"
                                            dataKey={() => selectedHabit.target}
                                            name="Target"
                                            stroke="#9CA3AF"
                                            strokeDasharray="5 5"
                                            strokeWidth={1}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-lg font-medium mb-4">Today's Update</h4>
                            <div className="mb-2">
                                <label className="block mb-2">
                                    {selectedHabit.current} / {selectedHabit.target} {selectedHabit.unit}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max={selectedHabit.target * 2}
                                    value={selectedHabit.current}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        updateHabitProgress(selectedHabit, value);
                                    }}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    style={{ accentColor: selectedHabit.color }}
                                />
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => {
                                        // Reset progress for today
                                        updateHabitProgress(selectedHabit, 0);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                                >
                                    Reset
                                </button>

                                <button
                                    onClick={() => {
                                        // Complete for today
                                        updateHabitProgress(selectedHabit, selectedHabit.target);
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Complete
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>Select a habit to view detailed insights</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Add Habit Modal
    const AddHabitModal = () => (
        <AnimatePresence>
            {isAddHabitOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className={`w-full max-w-md p-6 rounded-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add New Habit</h2>
                            <button
                                onClick={() => setIsAddHabitOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            addNewHabit();
                        }}>
                            <div className="mb-4">
                                <label htmlFor="habit-name" className="block mb-2">Habit Name</label>
                                <input
                                    type="text"
                                    id="habit-name"
                                    value={newHabit.name}
                                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                                    placeholder="E.g., Drink Water, Exercise, Read..."
                                    className={`w-full p-3 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="habit-target" className="block mb-2">Daily Target</label>
                                    <input
                                        type="number"
                                        id="habit-target"
                                        min="1"
                                        value={newHabit.target}
                                        onChange={(e) => setNewHabit({ ...newHabit, target: parseInt(e.target.value) })}
                                        className={`w-full p-3 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="habit-unit" className="block mb-2">Unit</label>
                                    <select
                                        id="habit-unit"
                                        value={newHabit.unit}
                                        onChange={(e) => setNewHabit({ ...newHabit, unit: e.target.value })}
                                        className={`w-full p-3 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                                    >
                                        <option value="times">times</option>
                                        <option value="minutes">minutes</option>
                                        <option value="hours">hours</option>
                                        <option value="glasses">glasses</option>
                                        <option value="pages">pages</option>
                                        <option value="steps">steps</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Habit Color</label>
                                <div className="flex space-x-2">
                                    {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewHabit({ ...newHabit, color })}
                                            className={`w-8 h-8 rounded-full ${newHabit.color === color ? 'ring-2 ring-offset-2 ring-indigo-600' : ''}`}
                                            style={{ backgroundColor: color }}
                                            aria-label={`Select color ${color}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddHabitOpen(false)}
                                    className="px-4 py-2 mr-2 border border-gray-300 rounded-md hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Add Habit
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Achievements Modal
    const AchievementsModal = () => (
        <AnimatePresence>
            {showAchievements && user && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className={`w-full max-w-2xl p-6 rounded-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Achievements</h2>
                            <button
                                onClick={() => setShowAchievements(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-600 text-white text-2xl">
                                    🏆
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-bold text-xl">{user.name}</h3>
                                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Level {user.level} • {user.points} points</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                            {user.achievements.map(achievement => (
                                <motion.div
                                    key={achievement.id}
                                    whileHover={{ y: -5 }}
                                    className={`p-4 rounded-lg ${achievement.completed
                                        ? darkMode ? 'bg-indigo-900 bg-opacity-30' : 'bg-indigo-50'
                                        : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                        }`}
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
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Reminder Toast
    const ReminderToast = () => (
        <AnimatePresence>
            {showReminder && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 right-4 z-50 max-w-xs bg-green-500 text-white p-4 rounded-lg shadow-lg"
                >
                    <div className="flex items-center">
                        <span className="text-xl mr-2">🎉</span>
                        <p>Great job! You've completed a habit today.</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Helper function to get the time of day message
    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Morning';
        if (hour < 18) return 'Afternoon';
        return 'Evening';
    };

    // Helper function to get motivational message
    const getMotivationalMessage = () => {
        const messages = [
            "You're making great progress. Keep up the good work!",
            "Small habits lead to big changes. Stay consistent!",
            "Every check-in brings you closer to your goals.",
            "Today is another opportunity to build better habits.",
            "Consistency is the key to transformation.",
            `You have ${habits.filter(h => h.current >= h.target).length} completed habits today. Amazing!`,
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    };

    return (
        <>
            <Head>
                <title>HabitHub - Personal Analytics & Habit Tracker</title>
                <meta name="description" content="Track your daily habits and personal stats with HabitHub" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
                {loading ? (
                    <LoadingScreen />
                ) : (
                    <>
                        <WelcomeOverlay />
                        <Navbar />
                        <Sidebar />

                        <div className="pt-20 pb-10 pl-16 md:pl-64 pr-4 md:pr-6">
                            <div className="container mx-auto max-w-6xl">
                                {currentView === 'dashboard' && <DashboardView />}
                                {currentView === 'habits' && <HabitsView />}
                                {currentView === 'insights' && <InsightsView />}
                            </div>
                        </div>

                        <AddHabitModal />
                        <AchievementsModal />
                        <ReminderToast />

                        {/* Habit Detail Modal */}
                        <AnimatePresence>
                            {selectedHabit && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0.9 }}
                                        className={`w-full max-w-md p-6 rounded-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-2">{selectedHabit.icon}</span>
                                                <h2 className="text-xl font-bold">{selectedHabit.name}</h2>
                                            </div>
                                            <button
                                                onClick={() => setSelectedHabit(null)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-sm text-gray-500 mb-1">Daily Progress</p>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xl font-bold">
                                                    {selectedHabit.current} / {selectedHabit.target} {selectedHabit.unit}
                                                </span>
                                                <span className="text-sm bg-indigo-600 bg-opacity-10 text-indigo-600 px-2 py-1 rounded-full">
                                                    {calculateProgress(selectedHabit.current, selectedHabit.target)}%
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${calculateProgress(selectedHabit.current, selectedHabit.target)}%`,
                                                        backgroundColor: selectedHabit.color
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-sm text-gray-500 mb-2">Update Progress</p>
                                            <div className="flex items-center justify-between mb-2">
                                                <button
                                                    onClick={() => {
                                                        if (selectedHabit.current > 0) {
                                                            updateHabitProgress(selectedHabit, selectedHabit.current - 1);
                                                        }
                                                    }}
                                                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-300"
                                                >
                                                    -
                                                </button>

                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={selectedHabit.target * 2}
                                                    value={selectedHabit.current}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value);
                                                        updateHabitProgress(selectedHabit, value);
                                                    }}
                                                    className="flex-1 mx-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                    style={{ accentColor: selectedHabit.color }}
                                                />

                                                <button
                                                    onClick={() => {
                                                        updateHabitProgress(selectedHabit, selectedHabit.current + 1);
                                                    }}
                                                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-300"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="flex justify-between mt-6">
                                                <button
                                                    onClick={() => {
                                                        updateHabitProgress(selectedHabit, 0);
                                                    }}
                                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                                                >
                                                    Reset
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        updateHabitProgress(selectedHabit, selectedHabit.target);
                                                    }}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                                >
                                                    Complete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center mb-2">
                                                <span className="text-xl mr-2">🔥</span>
                                                <p className="text-sm text-gray-500">Current Streak</p>
                                            </div>
                                            <p className="text-xl font-bold">{selectedHabit.streak} days</p>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4 mt-4">
                                            <p className="text-sm text-gray-500 mb-2">Weekly History</p>
                                            <div className="h-40">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart
                                                        data={getFilteredHistory(selectedHabit).slice(-7).map(item => ({
                                                            date: formatDate(item.date),
                                                            value: item.value
                                                        }))}
                                                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                                                    >
                                                        <XAxis dataKey="date" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="value"
                                                            name={selectedHabit.unit}
                                                            stroke={selectedHabit.color}
                                                            strokeWidth={2}
                                                            dot={{ r: 4 }}
                                                            activeDot={{ r: 6 }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </main>
        </>
    );
};

export default HabitTrackerApp;