import { useState, useEffect, useCallback } from 'react';
import { Habit, User, DashboardStats, Notification } from '../types';
import useLocalStorage from './useLocalStorage';
import {
    getMockHabits,
    getMockUser,
    getMockStats,
    getMockNotifications
} from '../utils/mockData';
import {
    calculateStreak,
    updateHabitHistory,
    calculateCompletionRate
} from '../utils/habitHelpers';
import { filterHistoryByDateRange } from '../utils/dateHelpers';

/**
 * Custom hook for managing habits data and operations
 */
const useHabits = () => {
    // Initialize state for habits, user, stats, and notifications
    const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
    const [user, setUser] = useLocalStorage<User | null>('user', null);
    const [stats, setStats] = useLocalStorage<DashboardStats | null>('stats', null);
    const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
    const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year' | 'all'>('week');
    const [dataInitialized, setDataInitialized] = useState(false);

    // Initialize with mock data if no data exists
    useEffect(() => {
        if (!dataInitialized && habits.length === 0) {
            const mockHabits = getMockHabits();
            const mockUser = getMockUser();
            const mockStats = getMockStats(mockHabits);
            const mockNotifications = getMockNotifications();

            setHabits(mockHabits);
            setUser(mockUser);
            setStats(mockStats);
            setNotifications(mockNotifications);
            setDataInitialized(true);
        }
    }, [dataInitialized, habits.length, setHabits, setUser, setStats, setNotifications]);

    // Update stats when habits change
    useEffect(() => {
        if (habits.length > 0) {
            const updatedStats = {
                ...(stats || getMockStats(habits)),
                totalHabits: habits.length,
                completionRate: calculateCompletionRate(habits),
                longestStreak: Math.max(...habits.map(h => h.streak))
            };
            setStats(updatedStats);
        }
    }, [habits, stats, setStats]);

    /**
     * Update a habit's progress
     */
    const updateHabitProgress = useCallback((habit: Habit, value: number) => {
        const updatedHabits = habits.map(h => {
            if (h.id === habit.id) {
                const newStreak = calculateStreak(h, value);
                const newHistory = updateHabitHistory(h, value);

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

        // Update selected habit if it's the one being modified
        if (selectedHabit && selectedHabit.id === habit.id) {
            setSelectedHabit(updatedHabits.find(h => h.id === habit.id) || null);
        }

        // Create notification for completed habits
        const updatedHabit = updatedHabits.find(h => h.id === habit.id);
        if (updatedHabit && updatedHabit.current >= updatedHabit.target && habit.current < habit.target) {
            const newNotification: Notification = {
                id: Date.now().toString(),
                message: `Great job! You completed your ${updatedHabit.name} habit.`,
                time: 'Just now',
                read: false
            };
            setNotifications([newNotification, ...notifications]);

            // Update user streak if needed
            if (user) {
                setUser({
                    ...user,
                    streak: Math.max(...updatedHabits.map(h => h.streak))
                });
            }
        }
    }, [habits, selectedHabit, notifications, user, setHabits, setNotifications, setUser]);

    /**
     * Add a new habit
     */
    const addHabit = useCallback((habitData: Partial<Habit>) => {
        if (!habitData.name) return;

        const today = new Date().toISOString();

        const newHabit: Habit = {
            id: Date.now().toString(),
            name: habitData.name,
            icon: habitData.icon || '📌',
            target: habitData.target || 1,
            unit: habitData.unit || 'times',
            current: 0,
            color: habitData.color || '#4F46E5',
            streak: 0,
            lastUpdated: today,
            history: [{ date: today.split('T')[0], value: 0 }]
        };

        setHabits([...habits, newHabit]);
    }, [habits, setHabits]);

    /**
     * Delete a habit
     */
    const deleteHabit = useCallback((habitId: string) => {
        const updatedHabits = habits.filter(h => h.id !== habitId);
        setHabits(updatedHabits);

        // Close habit detail if the deleted habit was selected
        if (selectedHabit && selectedHabit.id === habitId) {
            setSelectedHabit(null);
        }
    }, [habits, selectedHabit, setHabits]);

    /**
     * Mark a notification as read
     */
    const markNotificationAsRead = useCallback((id: string) => {
        const updatedNotifications = notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        );
        setNotifications(updatedNotifications);
    }, [notifications, setNotifications]);

    /**
     * Clear all notifications
     */
    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, [setNotifications]);

    /**
     * Get filtered history data based on date range
     */
    const getFilteredHistory = useCallback((habit: Habit) => {
        return filterHistoryByDateRange(habit.history, dateFilter);
    }, [dateFilter]);

    /**
     * Get completion rate for all habits
     */
    const getCompletionRate = useCallback(() => {
        return calculateCompletionRate(habits);
    }, [habits]);

    /**
     * Set date filter for history views
     */
    const setHistoryDateFilter = useCallback((filter: 'week' | 'month' | 'year' | 'all') => {
        setDateFilter(filter);
    }, []);

    return {
        habits,
        user,
        stats,
        notifications,
        selectedHabit,
        setSelectedHabit,
        dateFilter,
        setHistoryDateFilter,
        addHabit,
        updateHabitProgress,
        deleteHabit,
        markNotificationAsRead,
        clearAllNotifications,
        getCompletionRate,
        getFilteredHistory
    };
};

export default useHabits;