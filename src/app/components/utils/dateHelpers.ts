// Date helper functions for the Habit Tracker app

/**
 * Format a date string for display
 * @param date ISO date string
 * @returns Formatted date string (e.g., "Jan 15")
 */
export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Get a string representing the time of day (Morning, Afternoon, Evening)
 */
export const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
};

/**
 * Get today's date as an ISO string (YYYY-MM-DD)
 */
export const getTodayString = (): string => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Get yesterday's date as an ISO string (YYYY-MM-DD)
 */
export const getYesterdayString = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
};

/**
 * Filter history data based on a specified date range
 */
export const filterHistoryByDateRange = (
    history: { date: string; value: number }[],
    range: 'week' | 'month' | 'year' | 'all' = 'week'
): { date: string; value: number }[] => {
    const sortedHistory = [...history].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const today = new Date();

    switch (range) {
        case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);
            return sortedHistory.filter(item => new Date(item.date) >= weekAgo);

        case 'month':
            const monthAgo = new Date();
            monthAgo.setMonth(today.getMonth() - 1);
            return sortedHistory.filter(item => new Date(item.date) >= monthAgo);

        case 'year':
            const yearAgo = new Date();
            yearAgo.setFullYear(today.getFullYear() - 1);
            return sortedHistory.filter(item => new Date(item.date) >= yearAgo);

        default:
            return sortedHistory;
    }
};

/**
 * Get a random motivational message
 */
export const getMotivationalMessage = (completedHabits: number): string => {
    const messages = [
        "You're making great progress. Keep up the good work!",
        "Small habits lead to big changes. Stay consistent!",
        "Every check-in brings you closer to your goals.",
        "Today is another opportunity to build better habits.",
        "Consistency is the key to transformation.",
        `You have ${completedHabits} completed habits today. Amazing!`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
};