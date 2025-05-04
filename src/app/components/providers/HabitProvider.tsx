'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useHabits from '../hooks/useHabits';
import { HabitContextType } from '../types';

// Create habit context
const HabitContext = createContext<HabitContextType | undefined>(undefined);

// Habit provider component
export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const habitData = useHabits();

    return (
        <HabitContext.Provider value={habitData}>
            {children}
        </HabitContext.Provider>
    );
};

// Custom hook to use the habit context
export const useHabitContext = (): HabitContextType => {
    const context = useContext(HabitContext);
    if (context === undefined) {
        throw new Error('useHabitContext must be used within a HabitProvider');
    }
    return context;
};