// Utility functions for habit management

import { Habit } from "../types";
import { getTodayString, getYesterdayString } from "./dateHelpers";

/**
 * Calculate progress percentage for a habit
 */
export const calculateProgress = (current: number, target: number): number => {
    return Math.min(Math.round((current / target) * 100), 100);
};

/**
 * Generate a random icon for a habit
 */
export const getRandomHabitIcon = (): string => {
    const habitIcons = ['💧', '🏃', '🧘', '📚', '😴', '📵', '🍎', '✍️', '🧹', '🎵', '💻', '🧠', '🔄', '🌱'];
    return habitIcons[Math.floor(Math.random() * habitIcons.length)];
};

/**
 * Calculate if a streak should be updated based on habit completion
 */
export const calculateStreak = (habit: Habit, newValue: number): number => {
    let newStreak = habit.streak;
    const today = getTodayString();
    const lastUpdate = new Date(habit.lastUpdated).toISOString().split('T')[0];

    // If last update was not today, check if we're on a streak
    if (lastUpdate !== today) {
        const yesterday = getYesterdayString();

        if (lastUpdate === yesterday && newValue >= habit.target) {
            // If last update was yesterday and today's value meets target, increase streak
            newStreak += 1;
        } else if (newValue < habit.target) {
            // If today's value doesn't meet target, reset streak
            newStreak = 0;
        }
    } else if (habit.current < habit.target && newValue >= habit.target) {
        // If updating from incomplete to complete today, increase streak
        newStreak += 1;
    } else if (habit.current >= habit.target && newValue < habit.target) {
        // If updating from complete to incomplete today, decrease streak
        newStreak = Math.max(0, newStreak - 1);
    }

    return newStreak;
};

/**
 * Update habit history for the current day
 */
export const updateHabitHistory = (
    habit: Habit,
    value: number
): { date: string; value: number }[] => {
    const today = getTodayString();
    const historyIndex = habit.history.findIndex(item => item.date === today);
    let newHistory = [...habit.history];

    if (historyIndex >= 0) {
        newHistory[historyIndex] = { date: today, value };
    } else {
        newHistory.push({ date: today, value });
    }

    return newHistory;
};

/**
 * Check if a habit is completed for today
 */
export const isHabitCompletedToday = (habit: Habit): boolean => {
    const today = getTodayString();
    const todayEntry = habit.history.find(item => item.date === today);
    return todayEntry ? todayEntry.value >= habit.target : false;
};

/**
 * Calculate overall completion rate for a list of habits
 */
export const calculateCompletionRate = (habits: Habit[]): number => {
    if (!habits.length) return 0;

    const completed = habits.filter(habit => habit.current >= habit.target).length;
    return Math.round((completed / habits.length) * 100);
};