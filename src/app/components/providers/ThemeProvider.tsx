'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useTheme from '../hooks/useTheme';
import { ThemeContextType } from '../types';

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [darkMode, toggleDarkMode] = useTheme();

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <div className={`${darkMode ? 'dark' : ''}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme context
export const useThemeContext = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};