// Mock data for the Habit Tracker app
import { Habit, User, DashboardStats, Notification } from "../types";

/**
 * Generate random history data for habits
 */
export const generateRandomHistory = (days: number, max: number) => {
    return Array.from({ length: days }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - days + i + 1);
        return {
            date: date.toISOString().split('T')[0],
            value: Math.floor(Math.random() * (max + 1))
        };
    });
};

/**
 * Create mock habits data
 */
export const getMockHabits = (): Habit[] => {
    return [
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
            name: 'Digital Detox',
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
};

/**
 * Create mock user data
 */
export const getMockUser = (): User => {
    return {
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
};

/**
 * Create mock dashboard stats
 */
export const getMockStats = (habits: Habit[]): DashboardStats => {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return {
        completionRate: 76,
        totalHabits: habits.length,
        longestStreak: 15,
        weeklyProgress: weekDays.map(day => ({
            day,
            completed: Math.floor(Math.random() * (habits.length + 1)),
            total: habits.length
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
};

/**
 * Create mock notifications
 */
export const getMockNotifications = (): Notification[] => {
    return [
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
};