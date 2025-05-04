// Types for the Habit Tracker Application

// Define the Habit type
export type Habit = {
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

// Define the User type
export type User = {
    name: string;
    avatar: string;
    streak: number;
    level: number;
    points: number;
    achievements: Achievement[];
};

// Define the Achievement type
export type Achievement = {
    id: string;
    name: string;
    icon: string;
    completed: boolean;
    description: string;
};

// Define the DashboardStats type
export type DashboardStats = {
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

// Define the Notification type
export type Notification = {
    id: string;
    message: string;
    time: string;
    read: boolean;
};

// Define the Theme context type
export type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};

// Define the Habit context type
export type HabitContextType = {
    habits: Habit[];
    user: User | null;
    stats: DashboardStats | null;
    notifications: Notification[];
    selectedHabit: Habit | null;
    setSelectedHabit: (habit: Habit | null) => void;
    addHabit: (habit: Partial<Habit>) => void;
    updateHabitProgress: (habit: Habit, value: number) => void;
    deleteHabit: (habitId: string) => void;
    markNotificationAsRead: (id: string) => void;
    clearAllNotifications: () => void;
    getCompletionRate: () => number;
    getFilteredHistory: (habit: Habit) => { date: string; value: number }[];
};